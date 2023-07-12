import { createPinia } from 'pinia'
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import DialogService from 'primevue/dialogservice'
import ConfirmationService from 'primevue/confirmationservice'

import { idleTimerPlugin, IIdleTimerPluginOptions } from '@/plugins/idleTimer'
import router from '@/router'
import i18nInstance from '@/locales'
import { authorizationModuleStore } from '@/modules/authorization/stores'
import App from '@/App.vue'

import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18nInstance)
app.use(PrimeVue)
app.use(ToastService)
app.use(DialogService)
app.use(ConfirmationService)


const authStore = authorizationModuleStore()
const sessionExpiredAction = (): void => {
  authStore.logout()
  router.push('/')
}

const vSessionLifetime = parseInt(import.meta.env.VITE_APP_VIRTUAL_SESSION_LIFETIME, 10)
app.use(idleTimerPlugin, {
  onTimeout: sessionExpiredAction,
  onExpired: sessionExpiredAction,
  timeout: vSessionLifetime,
  storeKeyPrefix: '__template_front_app__',
} as IIdleTimerPluginOptions)

app.mount('#app')

export { app }
