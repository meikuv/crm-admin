import { IIdleTimerPluginOptions } from '@/plugins/idleTimer/interfaces'
// TODO: Сделать возможность менять время таймаута после инициализации
class IdleTimer {
  private timeout: number
  private onTimeout: () => void
  private eventHandler = (): any => {}
  private interval: ReturnType<typeof setInterval> | undefined
  private timeoutTracker: ReturnType<typeof setTimeout> | undefined
  static storeValueKey = 'idle_timer_expiredTime'
  static readonly numberSystem = 10

  constructor({ timeout, onTimeout, onExpired, storeKeyPrefix }: Required<IIdleTimerPluginOptions>) {
    this.timeout = timeout
    this.onTimeout = onTimeout
    IdleTimer.storeValueKey = storeKeyPrefix + IdleTimer.storeValueKey

    const expiredTime = this.getExpiredTime()
    if (expiredTime > 0 && expiredTime < Date.now()) {
      onExpired()
      return
    }

    this.eventHandler = this.updateExpiredTime.bind(this)
    this.startTrack()
  }

  private getExpiredTime = (): number => {
    return parseInt(localStorage.getItem(IdleTimer.storeValueKey) || '0', IdleTimer.numberSystem)
  }

  private startInterval(): void {
    this.updateExpiredTime()

    this.interval = setInterval(() => {
      const expiredTime = this.getExpiredTime()
      if (expiredTime < Date.now()) {
        if (this.onTimeout) {
          this.onTimeout()
          this.cleanUp()
        }
      }
    }, 1000)
  }

  private updateExpiredTime(): void {
    if (this.timeoutTracker) {
      clearTimeout(this.timeoutTracker)
    }
    this.timeoutTracker = setTimeout(() => {
      this.setCurrentTime()
    }, 300)
  }

  private tracker(): void {
    window.addEventListener('mousemove', this.eventHandler)
    window.addEventListener('scroll', this.eventHandler)
    window.addEventListener('keydown', this.eventHandler)
  }

  public setCurrentTime(): void {
    localStorage.setItem(IdleTimer.storeValueKey, String(Date.now() + this.timeout))
  }

  public cleanUp(): void {
    localStorage.removeItem(IdleTimer.storeValueKey)
    clearInterval(this.interval)
    window.removeEventListener('mousemove', this.eventHandler)
    window.removeEventListener('scroll', this.eventHandler)
    window.removeEventListener('keydown', this.eventHandler)
  }

  public startTrack(): void {
    this.tracker()
    this.startInterval()
  }
}

export default IdleTimer
