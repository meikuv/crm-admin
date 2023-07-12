import { defineStore } from 'pinia'
import AuthService from '@/modules/authorization/services/authService'
import TokenService from '@/modules/authorization/services/token.service'

export const authorizationModuleStore = defineStore('authorizationModule', {
  state: () => {
    return {
      loggedIn: false as boolean,
      user: {} as string | unknown,
      currentUser: TokenService.getCurrentUser() as string | null,
    }
  },
  getters: {
    isLoggedIn(state): boolean {
      return state.loggedIn
    },
    getCurrentUser(state): string | null {
      if (TokenService.getCurrentUser() !== '') {
        this.user = TokenService.getUser()
        this.currentUser = TokenService.getCurrentUser()
        this.loggedIn = this.user != null
      }
      return state.currentUser
    },
  },
  actions: {
    refreshToken() {
      this.loginSuccess()
    },
    login(user: Record<string, string>) {
      return AuthService.login(user).then(
        (user: any) => {
          this.loginSuccess()
          return Promise.resolve(user)
        },
        (error: any) => {
          this.loginFailure()
          return Promise.reject(error)
        },
      )
    },
    logout(): void {
      AuthService.logout()
      this.loggedIn = false
      this.user = {}
    },
    loginSuccess(): void {
      this.loggedIn = true
      this.user = TokenService.getUser()
      this.currentUser = TokenService.getCurrentUser()
    },
    loginFailure(): void {
      this.loggedIn = false
      this.user = {}
    },
  },
})
