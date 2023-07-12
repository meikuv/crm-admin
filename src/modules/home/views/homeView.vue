<template>
  <div class="home-page-wrapper">
    <p-button label="Вывести уведомление" @click="showNotifications" />
  </div>
</template>

<script lang="ts" setup>
import PButton from 'primevue/button'
import { info, error, success, warn } from '@/composables/showToastMessage'

const showNotifications = (): void => {
  info(
    'Заголовок уведомления',
    'Далеко-далеко за словесными горами в стране гласных и согласных, живут рыбные тексты.',
    5_000,
  )
  error(
    'Заголовок уведомления',
    'Далеко-далеко за словесными горами в стране гласных и согласных, живут рыбные тексты.',
    6_000,
  )
  success(
    'Заголовок уведомления',
    'Далеко-далеко за словесными горами в стране гласных и согласных, живут рыбные тексты.',
    7_000,
  )
  warn(
    'Заголовок уведомления',
    'Далеко-далеко за словесными горами в стране гласных и согласных, живут рыбные тексты.',
    8_000,
  )
}
</script>

<style scoped>
.home-page-wrapper {
  margin: auto;
}
</style>
