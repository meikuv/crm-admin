export interface IIdleTimerPluginOptions {
  timeout?: number
  onTimeout: (...args: any) => void
  onExpired?: () => void
  storeKeyPrefix?: string
}

export interface IIdleTimerPluginControls {
  stop: () => void
  start: () => void
}
