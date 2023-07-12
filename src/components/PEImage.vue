<template>
  <span :class="containerClass" :style="style">
    <img v-bind="$attrs" :style="imageStyle" :class="imageClass" @error="onError" />
    <div v-if="preview" class="p-image-preview-indicator" @click="onImageClick">
      <slot name="indicator">
        <i class="p-image-preview-icon pi pi-eye" />
      </slot>
    </div>
    <portal>
      <div v-if="maskVisible" :ref="maskRef" :class="maskClass" @click="onMaskClick">
        <div class="p-image-toolbar">
          <button v-if="prevFn" class="p-image-action p-link" type="button" @click="prev">
            <i class="pi pi-angle-left" />
          </button>
          <button v-if="nextFn" class="p-image-action p-link" type="button" @click="next">
            <i class="pi pi-angle-right" />
          </button>
          <button class="p-image-action p-link" type="button" @click="rotateRight">
            <i class="pi pi-refresh" />
          </button>
          <button class="p-image-action p-link" type="button" @click="rotateLeft">
            <i class="pi pi-undo" />
          </button>
          <button
            v-if="zoom === 'button'"
            class="p-image-action p-link"
            type="button"
            :disabled="zoomDisabled"
            @click="zoomOut"
          >
            <i class="pi pi-search-minus" />
          </button>
          <button
            v-if="zoom === 'button'"
            class="p-image-action p-link"
            type="button"
            :disabled="zoomDisabled"
            @click="zoomIn"
          >
            <i class="pi pi-search-plus" />
          </button>
          <button class="p-image-action p-link" type="button" @click="hidePreview">
            <i class="pi pi-times" />
          </button>
        </div>
        <transition
          name="p-image-preview"
          @before-enter="onBeforeEnter"
          @enter="onEnter"
          @leave="onLeave"
          @before-leave="onBeforeLeave"
          @after-leave="onAfterLeave"
        >
          <div
            v-if="previewVisible"
            ref="zoomWrapper"
            class="p-image-preview__wrapper"
            @click.prevent="$event.stopPropagation()"
          >
            <img
              ref="previewImg"
              v-zoom:[wheelZoomEnable]
              :src="$attrs.src"
              class="p-image-preview"
              :style="imagePreviewStyle"
              @click="onPreviewImageClick"
            />
          </div>
        </transition>
      </div>
    </portal>
  </span>
</template>

<script lang="ts">
/* eslint-disable */
// @ts-nocheck
import { DomHandler, ZIndexUtils } from 'primevue/utils'
import Portal from 'primevue/portal'
import vWheelZoom from '@/utils/directives/ImageWheelZoom'

export default {
  name: 'PEImage',
  components: {
    Portal,
  },
  inheritAttrs: false,
  props: {
    preview: {
      type: Boolean,
      default: false,
    },
    class: null,
    style: null,
    imageStyle: null,
    imageClass: null,
    nextFn: {
      type: [Function, null],
      default: null,
    },
    prevFn: {
      type: [Function, null],
      default: null,
    },
    zoom: {
      type: String,
      default: 'button',
      validator: val => {
        return ['wheel', 'button'].includes(val)
      },
    },
  },
  emits: ['show', 'hide', 'error'],
  mask: null,
  data() {
    return {
      maskVisible: false,
      previewVisible: false,
      rotate: 0,
      scale: 1,
      viewportClicked: false,
    }
  },
  directives: {
    zoom: vWheelZoom,
  },
  computed: {
    wheelZoomEnable() {
      return this.zoom === 'wheel' ? 'enabled' : 'disabled'
    },
    containerClass() {
      return [
        'p-image p-component',
        this.class,
        {
          'p-image-preview-container': this.preview,
        },
      ]
    },
    maskClass() {
      return ['p-image-mask p-component-overlay p-component-overlay-enter']
    },
    rotateClass() {
      return 'p-image-preview-rotate-' + this.rotate
    },
    imagePreviewStyle() {
      return { transform: 'rotate(' + this.rotate + 'deg) scale(' + this.scale + ')' }
    },
    zoomDisabled() {
      return this.scale <= 0.5 || this.scale >= 5.5
    },
  },
  beforeUnmount() {
    if (this.mask) {
      ZIndexUtils.clear(this.container)
    }
  },
  methods: {
    navWithKeyboard(e) {
      const code = e.keyCode
      console.log(`file: PEImage.vue > line 149 > navWithKeyboard > code`, code)
      if (code === 37) this.prev()
      if (code === 39) this.next()
    },
    maskRef(el) {
      this.mask = el
    },
    toolbarRef(el) {
      this.toolbarRef = el
    },
    onImageClick() {
      if (this.preview) {
        this.maskVisible = true
        setTimeout(() => {
          this.previewVisible = true
        }, 25)
      }
    },
    onPreviewImageClick() {
      this.previewClick = true
    },
    onMaskClick() {
      if (!this.previewClick) {
        this.previewVisible = false
        this.rotate = 0
        this.scale = 1
      }

      this.previewClick = false
    },
    onError() {
      this.$emit('error')
    },
    rotateRight() {
      this.rotate += 90
      this.previewClick = true
    },
    rotateLeft() {
      this.rotate -= 90
      this.previewClick = true
    },
    zoomIn() {
      this.scale = this.scale + 0.1
      this.previewClick = true
    },
    zoomOut() {
      this.scale = this.scale - 0.1
      this.previewClick = true
    },
    prev() {
      console.log('prev image')
      if (this.prevFn) {
        this.previewClick = true
        this.prevFn('prev')
      }
    },
    next() {
      console.log('next image')
      if (this.nextFn) {
        this.previewClick = true
        this.nextFn('next')
      }
    },
    onBeforeEnter() {
      ZIndexUtils.set('modal', this.mask, this.$primevue.config.zIndex.modal)
      window.addEventListener('keydown', this.navWithKeyboard)
    },
    onEnter() {
      this.$emit('show')
    },
    onBeforeLeave() {
      DomHandler.addClass(this.mask, 'p-component-overlay-leave')
      window.removeEventListener('keydown', this.navWithKeyboard)
    },
    onLeave() {
      this.$emit('hide')
    },
    onAfterLeave(el) {
      ZIndexUtils.clear(el)
      this.maskVisible = false
    },
  },
}
</script>

<style>
.p-image-mask {
  display: flex;
  align-items: center;
  justify-content: center;
}

.p-image-preview-container {
  position: relative;
  display: inline-block;
}

.p-image-preview-indicator {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.p-image-preview-icon {
  font-size: 1.5rem;
}

.p-image-preview-container:hover > .p-image-preview-indicator {
  opacity: 1;
  cursor: pointer;
}

.p-image-preview-container > img {
  cursor: pointer;
}

.p-image-toolbar {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  z-index: 1;
  background-color: rgba(0, 0, 0, 0.7);
}

.p-image-action.p-link {
  display: flex;
  justify-content: center;
  align-items: center;
}

.p-image-preview {
  transition: transform 0.15s;
  max-width: 100vw;
  max-height: 100vh;
}

.p-image-preview-enter-active {
  transition: all 150ms cubic-bezier(0, 0, 0.2, 1);
}
.p-image-preview-leave-active {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
}
.p-image-preview-enter-from,
.p-image-preview-leave-to {
  opacity: 0;
  transform: scale(0.7);
}
</style>
