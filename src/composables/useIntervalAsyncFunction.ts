type AFn = <I = any>() => Promise<I | any>
type Fn = () => void
type TTimer = ReturnType<typeof setInterval> | null

export interface IuseIntervalFnControls {
  play: Fn
  stop: Fn
}

export default function useIntervalAsyncFn(
  cb: AFn,
  interval: number = 5000,
  immediate: boolean = true,
): IuseIntervalFnControls {
  if (cb.constructor.name !== 'AsyncFunction') {
    throw new TypeError('Входная функция не является асинхронной')
  }
  let stopped: boolean = false
  let timer: TTimer = null
  let lastExecute: number = 0

  function getTimeoutForExecute(): number {
    return Math.max(interval - (Date.now() - lastExecute), 0)
  }

  function clear(): void {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function stop(): void {
    clear()
    stopped = true
  }

  function play(): void {
    lastExecute = Date.now()
    if (stopped) stopped = false
    clear()
    cb().finally(() => {
      if (!stopped) timer = setTimeout(play, getTimeoutForExecute())
    })
  }

  if (immediate) play()

  return {
    play,
    stop,
  }
}
