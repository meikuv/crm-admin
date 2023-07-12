import { defineStore } from 'pinia'
import ScreensService  from '../services/screensService'
import { Screens }  from '@//typings'

export const screensStore = defineStore({
  id: 'screensStore',
  state: () => ({
    screens: [] as Screens[],
    screen: {} as Screens,
    error: [],
    loading: false,
    headers: [] as string[]
  }),
  getters: {
    getScreens(state): Screens[] {
      return state.screens
    },
    getScreenById(state): Screens {
      return state.screen
    },
    getScreensHeaders(state) {
      return state.headers
    }
  },
  actions: {
    async fetchScreens(): Promise<void> {
      this.screens = []
      this.loading = true
      await new ScreensService().getScreens().then(
        (response) => {
          this.screens = response.data
          this.setHeaders()
        },
        (error) => {
          this.error =
            (error.response &&
              error.response.data &&
              error.response.data.message)
            ||
            error.message ||
            error.toString()
        }
      )
      this.loading = false
    },
    async fetchScreen(id: number) {
      this.loading = true
      await new ScreensService().getScreen(id).then(
        (response) => {
          this.screen = (response.data)
        },
        (error) => {
          this.error =
            <never>(
              (error.response &&
                error.response.data &&
                error.response.data.message)
            ) ||
            error.message ||
            error.toString()
        }
      )
      this.loading = false
    },
    async newScreen(screen: Screens) {
      await new ScreensService().createScreen(screen).then(
        () => {
          this.screens.push(screen)
        },
        (error) => {
          this.error =
            <never>(
              (error.response &&
                error.response.data &&
                error.response.data.message)
            ) ||
            error.message ||
            error.toString()
        }
      )
      await this.fetchScreens()
    },

    async deleteScreen(item: Screens, id: number) {
      const index = this.screens.indexOf(item)
      await new ScreensService().deleteScreen(id).then(
        () => {
          this.screens.splice(index, 1)
        },
        (error) => {
          this.error =
            <never>(
              (error.response &&
                error.response.data &&
                error.response.data.message)
            ) ||
            error.message ||
            error.toString()
        }
      )
    },
    setLoading(b: boolean) {
      this.loading = b
    },
    cleanStore() {
      this.screens = []
    },
    setHeaders() {
      if (this.screens[0]) {
        this.headers = Object.keys(this.screens[0])
        const removeItems = (array: any, itemsToRemove: any): any => {
          return array.filter((v: any) => {
            return !(itemsToRemove === v)
          });
        }
        this.headers = removeItems(this.headers, 'views')
      }
    }
  },
})
