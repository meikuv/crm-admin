<template>
  <div class="app-layout">
    <dynamic-dialog />
    <toast />
    <router-view name="header" />
    <main class="app-layout__content">
      <router-view name="navigation" />
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
/* global __APP_VER__, __APP_MODE__, __APP_DATE_BUILD__, __APP_ENV__ */
import DynamicDialog from 'primevue/dynamicdialog'
import Toast from 'primevue/toast'
import '@/styles/App.scss'

/* eslint-disable no-console */
console.group('⚙ BUILD INFO')
console.info('Версия приложения =', __APP_VER__)
console.info('Режим сборки =', __APP_MODE__)
console.info('Окружение сборки =', __APP_ENV__)
console.info('Дата сборки =', new Date(__APP_DATE_BUILD__).toLocaleString('KZ', { timeZone: 'Asia/Almaty' }))
console.groupEnd()
/* eslint-enable no-console */
</script>
