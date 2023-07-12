<template>
  <nav class="navigation">
    <ul class="tabs">
      <li v-for="screen in screens" :key="screen.name">
        <a :class="{ active: screen.name === currentScreen }" @click.prevent="currentScreen = screen.name">
          <span>{{ t(`applicationTabs.${screen.name}`) }}</span>
        </a>
      </li>
    </ul>
    <ul v-if="currentViews" class="views">
      <li v-for="view in currentViews" :key="view.routeName">
        <router-link active-class="active" :to="{ name: view.routeName }">
          <span> {{ t(`applicationViews.${view.name}`) }} </span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useNavigation } from '@/modules/navigation/composables/useNavigation'
const { t } = useI18n({ useScope: 'global' })
const { screens, currentViews, currentScreen } = useNavigation()
</script>

<style lang="scss" src="./applicationTabs.scss" scoped></style>
