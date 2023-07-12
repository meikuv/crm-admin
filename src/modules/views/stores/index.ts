import { defineStore } from 'pinia'
import ViewsService from '../services/viewsService'
import { Views }  from '@//typings'

export const viewsStore = defineStore({
  id: 'viewsStore',
  state: () => ({
    views: [] as Views[],
    view: {} as Views,
    error: [],
    loading: false,
    headers: [] as string[]
  }),
  getters: {
    getViews(state): Views[] {
      return state.views
    },
    getViewById(state): Views {
      return state.view
    },
    getViewsHeaders(state) {
      return state.headers
    }
  },
  actions: {
    async fetchViews(): Promise<void> {
      this.views = []
      this.loading = true
      await new ViewsService().getViews().then(
        (response) => {
          this.views = response.data
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
    async fetchView(id: number) {
      this.loading = true
      await new ViewsService().getView(id).then(
        (response) => {
          // @ts-ignore
          this.view = (response.data)
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
    async newView(view: Views) {
      await new ViewsService().createView(view).then(
        () => {
          this.views.push(view)
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
      await this.fetchViews()
    },

    async deleteView(item: Views, id: number) {
      const index = this.views.indexOf(item)
      await new ViewsService().deleteView(id).then(
        () => {
          this.views.splice(index, 1)
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
      this.views = []
    },
    setHeaders() {
      if (this.views[0]) {
        this.headers = Object.keys(this.views[0])
        const removeItems = (array: any, itemsToRemove: any): any => {
          return array.filter((v: any) => {
            return !(itemsToRemove === v)
          });
        }
        this.headers = removeItems(this.headers, 'roles')
      }
    }
  },
})
