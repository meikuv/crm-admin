import throttle from '@/utils/throttle'
import { DirectiveBinding, ObjectDirective, VNode } from 'vue'

export interface IWheelZoomOptions {
  zoom: number
  maxZoom: number
  initialZoom: number
  initialX: number
  initialY: number
}

const defaults: IWheelZoomOptions = {
  zoom: 0.1,
  maxZoom: 5,
  initialZoom: 1,
  initialX: 0.5,
  initialY: 0.5,
}

const settings: IWheelZoomOptions = { ...defaults }
let img: HTMLImageElement
let initSrc: string
let width: number
let height: number
let bgWidth: number
let bgHeight: number
let bgPosX: number
let bgPosY: number
let previousEvent: MouseEvent
let transparentSpaceFiller: string
const throttleDrag = throttle(drag, 20)

function onImageLoad(this: HTMLImageElement): void {
  prepareImage(this).then(
    () => {
      bindEvents(this)
    },
    error => console.error(error),
  )
}

function bindEvents(img: HTMLImageElement): void {
  img.addEventListener('wheel', onwheel)
  img.addEventListener('mousedown', draggable)
}

function unBindEvents(img: HTMLImageElement): void {
  img.removeEventListener('wheel', onwheel)
  img.removeEventListener('mousedown', draggable)
  removeDrag()
}

function updateBgStyle(): void {
  if (bgPosX > 0) {
    bgPosX = 0
  } else if (bgPosX < width - bgWidth) {
    bgPosX = width - bgWidth
  }

  if (bgPosY > 0) {
    bgPosY = 0
  } else if (bgPosY < height - bgHeight) {
    bgPosY = height - bgHeight
  }

  // img.style.backgroundSize = bgWidth+'px '+ bgHeight+'px';
  img.style.backgroundSize = `${bgWidth}px auto`
  img.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`
}

function reset(): void {
  bgWidth = width
  bgHeight = height
  bgPosX = bgPosY = 0
  updateBgStyle()
}

function onwheel(e: WheelEvent): void {
  let deltaY = 0

  e.preventDefault()

  if (e.deltaY) {
    // FireFox 17+ (IE9+, Chrome 31+?)
    deltaY = e.deltaY
  }

  // As far as I know, there is no good cross-browser way to get the cursor position relative to the event target.
  // We have to calculate the target element's position relative to the document, and subtrack that from the
  // cursor's position relative to the document.
  // let rect = img.getBoundingClientRect();
  // let offsetX = e.pageX - rect.left - window.pageXOffset;
  // let offsetY = e.pageY - rect.top - window.pageYOffset;

  // Record the offset between the bg edge and cursor:
  const bgCursorX = e.offsetX - bgPosX
  const bgCursorY = e.offsetY - bgPosY

  // Use the previous offset to get the percent offset between the bg edge and cursor:
  const bgRatioX = bgCursorX / bgWidth
  const bgRatioY = bgCursorY / bgHeight

  // Update the bg size:
  if (deltaY < 0) {
    bgWidth += bgWidth * settings.zoom
    bgHeight += bgHeight * settings.zoom
  } else {
    bgWidth -= bgWidth * settings.zoom
    bgHeight -= bgHeight * settings.zoom
  }

  if (settings.maxZoom) {
    bgWidth = Math.min(width * settings.maxZoom, bgWidth)
    bgHeight = Math.min(height * settings.maxZoom, bgHeight)
  }

  // Take the percent offset and apply it to the new size:
  bgPosX = e.offsetX - bgWidth * bgRatioX
  bgPosY = e.offsetY - bgHeight * bgRatioY

  // Prevent zooming out beyond the starting size
  if (bgWidth <= width || bgHeight <= height) {
    reset()
  } else {
    updateBgStyle()
  }
}

function drag(e: MouseEvent): void {
  e.preventDefault()
  bgPosX += e.offsetX - previousEvent.offsetX
  bgPosY += e.offsetY - previousEvent.offsetY
  previousEvent = e
  updateBgStyle()
}

function removeDrag(): void {
  document.removeEventListener('mouseup', removeDrag)
  // @ts-ignore:next-line
  document.removeEventListener('mousemove', throttleDrag)
}

// Make the background draggable
function draggable(e: MouseEvent): void {
  e.preventDefault()
  previousEvent = e
  // @ts-ignore:next-line
  document.addEventListener('mousemove', throttleDrag)
  document.addEventListener('mouseup', removeDrag)
}

function getTransparentSpaceForSrc(w: number, h: number): string {
  const svgHack = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"></svg>`
  return 'data:image/svg+xml;base64,' + window.btoa(svgHack)
}

function prepareImage(img: HTMLImageElement): Promise<HTMLImageElement> {
  return new Promise(resolve => {
    try {
      const initial = Math.max(settings.initialZoom, 1)
      initSrc = img?.src

      // if (initSrc === transparentSpaceFiller) return
      if (initSrc === transparentSpaceFiller) resolve(img)

      const computedStyle = window.getComputedStyle(img, null)

      width = parseInt(computedStyle.width, 10)
      height = parseInt(computedStyle.height, 10)
      bgWidth = width * initial
      bgHeight = height * initial
      bgPosX = -(bgWidth - width) * settings.initialX
      bgPosY = -(bgHeight - height) * settings.initialY
      transparentSpaceFiller = getTransparentSpaceForSrc(img.naturalWidth, img.naturalHeight)

      img.style.backgroundSize = `${bgWidth}px ${bgHeight}px`
      img.style.backgroundRepeat = 'no-repeat'
      img.style.backgroundImage = `url("${initSrc}")`
      img.style.backgroundSize = `${bgWidth}px auto`
      img.style.backgroundPosition = `${bgPosX}px ${bgPosY}px`
      img.style.cursor = 'move'
      img.src = transparentSpaceFiller

      resolve(img)
    } catch (error: unknown) {
      if (error instanceof Error) throw new Error('Не удалось подготовить изображение к функционалу увеличения', error)
    }
  })
}

function main(el: HTMLImageElement, binding: DirectiveBinding, vnode: VNode): void {
  // Не делаем ничего если:
  // Директиву использовали не на картинке
  // Директиву в директиву прокинули атрибут с именем disabled
  // Если картинка с которой работаем уже была обработана директивой
  if (vnode.type !== 'img' || binding.arg?.includes('disabled') || el.src === transparentSpaceFiller) return
  // Применяем пользовательские настройки
  Object.assign(settings, binding.value)
  // Прокидываем в глобальную переменную текущею картинку на которой вызвана директива
  img = el
  if (img.complete) {
    onImageLoad.call(img)
  } else {
    img.addEventListener(
      'load',
      onImageLoad,
      // Говорим что после вызова функции нужно удалить её из прослушивания события
      // Это нужно чтобы она не вызывалась второй раз при замене SRC атрибута на SVG заглушку
      { once: true },
    )
  }
}

const vWheelZoom: ObjectDirective<HTMLImageElement, IWheelZoomOptions | undefined> = {
  mounted(el, binding, vnode) {
    main(el, binding, vnode)
  },
  beforeUnmount(el) {
    unBindEvents(el)
  },
  beforeUpdate(el) {
    if (el.src === transparentSpaceFiller) return
    unBindEvents(el)
  },
  updated(el, binding, vnode) {
    main(el, binding, vnode)
  },
}

export default vWheelZoom
