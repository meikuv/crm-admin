import IdleTimer from './IdleTimer'
import { IIdleTimerPluginControls, IIdleTimerPluginOptions } from '@/plugins/idleTimer/interfaces'
import { App, Plugin } from 'vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $idleTimer: IIdleTimerPluginControls
  }
}

const defaultOptions: Required<IIdleTimerPluginOptions> = {
  timeout: 900_000,
  onTimeout: () => {},
  onExpired: () => {},
  storeKeyPrefix: '__',
}

const createIdleTimer = (options: IIdleTimerPluginOptions): IIdleTimerPluginControls => {
  const currentOptions = { ...defaultOptions, ...options }
  const idleTimer = new IdleTimer(currentOptions)
  return {
    stop: () => idleTimer.cleanUp(),
    start: (): void => {
      idleTimer.setCurrentTime()
      idleTimer.startTrack()
    },
  }
}

export const idleTimerPlugin: Plugin = {
  install: (app: App, options: IIdleTimerPluginOptions) => {
    app.config.globalProperties.$idleTimer = createIdleTimer(options)
    app.provide('idleTimer', app.config.globalProperties.$idleTimer)
  },
}

export default idleTimerPlugin

export * from './interfaces'
