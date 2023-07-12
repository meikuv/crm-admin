import { MessageSchema } from '@/locales/schema'
import { createI18n } from 'vue-i18n'

import kz from './kz'
import ru from './ru'

type TLanguageCode = 'ru' | 'kk'

const i18nInstance = createI18n<MessageSchema, TLanguageCode>({
  legacy: false,
  locale: 'ru',
  fallbackLocale: 'kk',
  messages: {
    ru,
    kk: kz,
  },
})

export type { TLanguageCode }
export default i18nInstance
