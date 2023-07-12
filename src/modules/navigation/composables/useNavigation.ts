import router from '@/router'
import { authorizationModuleStore } from '@/modules/authorization/stores'
import siebelGatewayScreen from '@/services/siebel-gateway/screen'
import { ISiebelGatewayScreen, ISiebelGatewayView } from '@/services/siebel-gateway/screen/interfaces'
import { ref, Ref, computed, ComputedRef } from 'vue'

interface IuseNavigation {
  screens: Ref<ISiebelGatewayScreen[] | undefined>
  currentScreen: Ref<string>
  getUserViews: () => Promise<void>
  currentViews: ComputedRef<ISiebelGatewayView[] | null>
}

const authStore = authorizationModuleStore()
const _currentScreen = ref<string>('')
const screens = ref<ISiebelGatewayScreen[] | undefined>()

const currentScreen = computed({
  get() {
    return _currentScreen.value
  },
  set(newValue) {
    _currentScreen.value = newValue
  },
})

const currentViews = computed((): ISiebelGatewayView[] | null => {
  if (currentScreen.value && screens.value) {
    const selectedScreen = screens.value.find(screen => screen.name === currentScreen.value)
    if (selectedScreen) {
      return selectedScreen.views.filter(view => router.hasRoute(view.routeName))
    }
    return null
  }
  return null
})

const findCurrentScreenName = (screens: ISiebelGatewayScreen[]): string => {
  const currentRouteName = router.currentRoute.value.name
  for (let i = 0; i < screens.length; i++) {
    const screen = screens[i]
    for (let j = 0; j < screen.views.length; j++) {
      const view = screen.views[j]
      if (view.routeName === currentRouteName) return screen.name
    }
  }
  return ''
}

const getUserViews = async (): Promise<void> => {
  if (authStore.currentUser) {
    const { data } = await siebelGatewayScreen.getUsersViews(authStore.currentUser)
    currentScreen.value = findCurrentScreenName(data.cfgScreens)
    screens.value = data.cfgScreens
  }
}

export type { IuseNavigation }
export const useNavigation = (): IuseNavigation => {
  if (!screens.value) getUserViews()
  return { screens, getUserViews, currentViews, currentScreen }
}
