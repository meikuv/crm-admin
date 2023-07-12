<template>
  <div class="auth-form">
    <p-message v-show="errorMessage" class="auth-form__error" :severity="'error'" @close="errorMessage = ''">
      {{ errorMessage }}
    </p-message>
    <div class="auth-form__headline">
      <svg-icon name="kaspiLogo" class="logo" />
      <p class="application-title">{{ applicationName }}</p>
    </div>
    <form @submit.prevent="login">
      <div class="input-wrap">
        <input id="login" v-model="username" type="text" name="login" autocomplete="on" required />
        <label for="login">{{ t('login.login') }}</label>
      </div>
      <div class="input-wrap">
        <input id="password" v-model="password" type="password" name="password" autocomplete="on" required />
        <label for="password">{{ t('login.pass') }}</label>
      </div>
      <label class="remember-me-label">
        <input id="rememberMe" type="checkbox" name="rememberMe" /> {{ t('login.rememberMe') }}
      </label>
      <p-button type="submit" class="login-button" :label="t('login.enter')" :loading="authIsPending" />
    </form>
  </div>
</template>

<script lang="ts" setup>
import PButton from 'primevue/button'
import PMessage from 'primevue/message'

import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import { authorizationModuleStore } from '@modules/authorization/stores'
import { useI18n } from 'vue-i18n'
import SvgIcon from '@components/icons/SvgIcon.vue'
import { AxiosError } from 'axios'
import { IAuthenticationData } from '@/modules/authorization/services/token.service'
import HttpStatusCode from '@/utils/dictionaries/httpStatusCode'
import { IIdleTimerPluginControls } from '@/plugins/idleTimer'

const router = useRouter()
const authUserStore = authorizationModuleStore()
const idleTimer = inject<IIdleTimerPluginControls>('idleTimer')
const authIsPending = ref(false)

const applicationName = 'App name'
const username = ref('')
const password = ref('')
const errorMessage = ref('')
const { t } = useI18n({ useScope: 'global' })

function login(): void {
  const user = {
    username: username.value,
    password: password.value,
  }
  authIsPending.value = true
  authUserStore.login(user).then(
    () => {
      authIsPending.value = false
      if (idleTimer) {
        idleTimer.start()
      }
      router.push({
        name: 'Home Page',
      })
    },
    (error: AxiosError<IAuthenticationData>) => {
      authIsPending.value = false
      if (error?.response?.data?.errorText === 'Invalid Credentials') {
        errorMessage.value = 'Не правильный логин или пароль'
        return
      }
      if (error.response?.status === HttpStatusCode.NOT_FOUND) {
        errorMessage.value = 'Пользователь не найден'
        return
      }
      errorMessage.value = error.message || error.toString()
    },
  )
}
</script>

<style lang="scss" src="./authorizationForm.scss" scoped></style>
