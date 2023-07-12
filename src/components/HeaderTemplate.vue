<template>
  <div class="header-section">
    <header class="header">
      <svg-icon name="kaspiLogo" class="logo" />
      <div class="header__profile-section">
        <language-choice />
        <span v-if="authUserStore.currentUser" class="user"> {{ authUserStore.getCurrentUser }}</span>
        <p-button v-if="authUserStore.currentUser" class="p-button-text logout-btn" @click="logOut">
          <svg-icon name="logoutBtn" class="logout-icon" />
        </p-button>
      </div>
    </header>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@components/icons/SvgIcon.vue'
import LanguageChoice from '@/components/LanguageChoice.vue'
import PButton from 'primevue/button'
import { authorizationModuleStore } from '@/modules/authorization/stores'
import { useRouter } from 'vue-router'
import { inject } from 'vue'
import { IIdleTimerPluginControls } from '@/plugins/idleTimer'

const authUserStore = authorizationModuleStore()
const router = useRouter()
const idleTimer = inject<IIdleTimerPluginControls>('idleTimer')

// выходим
function logOut(): void {
  authUserStore.logout()
  idleTimer?.stop()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  padding: 0 16px;
  background-color: $white;

  &-section {
    box-sizing: border-box;
    box-shadow: 0 4px 20px rgb(0 0 0 / 8%);
  }

  &__profile-section {
    display: flex;
    align-items: center;
  }
}

.logo {
  width: 40px;
  height: 40px;
  color: $redByKaspi;
}

.user {
  vertical-align: middle;
  padding-right: 10px;
  font-weight: bolder;
  font-size: 19px;
  color: $brownGrey;
}

.logout-btn {
  padding: 5px;
  width: 40px;
  height: 40px;
}

.logout-icon {
  height: 26px;
  color: $redByKaspi;
  transition: color 0.25s ease-in-out;

  &:hover {
    color: $tallPoppy;
  }
}
</style>
