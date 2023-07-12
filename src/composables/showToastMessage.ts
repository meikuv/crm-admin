import { app } from '@/main'
import { ToastSeverity } from 'primevue/api'

export function info(summary: string, detail: string, life: number = 8000): void {
  app.config.globalProperties.$toast.add({ severity: ToastSeverity.INFO, summary, detail, life })
}

export function warn(summary: string, detail: string, life: number = 8000): void {
  app.config.globalProperties.$toast.add({ severity: ToastSeverity.WARN, summary, detail, life })
}

export function success(summary: string, detail: string, life: number = 8000): void {
  app.config.globalProperties.$toast.add({ severity: ToastSeverity.SUCCESS, summary, detail, life })
}

export function error(summary: string, detail: string, life: number = 8000): void {
  app.config.globalProperties.$toast.add({ severity: ToastSeverity.ERROR, summary, detail, life })
}
