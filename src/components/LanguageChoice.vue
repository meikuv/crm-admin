<template>
  <div class="lang-block">
    <p-button
      class="p-button-text lang-button"
      icon="pi pi-globe"
      icon-pos="right"
      :label="currentLang?.label"
      @click="contextMenu?.toggle"
    />
    <p-menu ref="contextMenu" :model="menuItems" :popup="true" />
  </div>
</template>

<script lang="ts" setup>
import PMenu, { MenuProps } from 'primevue/menu'
import PButton from 'primevue/button'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { TLanguageCode } from '@/locales'

interface ILanguage {
  key: TLanguageCode
  label: string
}

const { locale } = useI18n({ useScope: 'global' })
const contextMenu = ref<PMenu>()

const languages: ILanguage[] = [
  {
    key: 'kk',
    label: 'Қазақ',
  },
  {
    key: 'ru',
    label: 'Русский',
  },
]

const menuItems: MenuProps['model'] = languages.map(lang => ({
  label: lang.label,
  command: () => setLanguage(lang.key),
}))

const currentLang = computed(() => languages.find(lang => lang.key === locale.value))

function setLanguage(langCode: string): void {
  if (langCode === sessionStorage.getItem('chosenLanguage')) return
  locale.value = langCode
  sessionStorage.setItem('chosenLanguage', langCode)
  document.querySelector('html')?.setAttribute('lang', locale.value as TLanguageCode)
}

locale.value = sessionStorage.getItem('chosenLanguage') || 'ru'
document.querySelector('html')?.setAttribute('lang', locale.value as TLanguageCode)
</script>

<style lang="scss" scoped>
.p-button.lang-button {
  color: var(--surface-900);
}
</style>
