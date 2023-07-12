import { defineStore } from 'pinia'
import ResponsibilitiesService from '../services/responsibilitiesService'
import { Roles }  from '@//typings'

export const responsibilitiesStore = defineStore({
  id: 'responsibilitiesStore',
  state: () => ({
    responsibilities: [] as Roles[],
    responsibility: {} as Roles,
    error: [],
    loading: false as boolean,
    headers: [] as string[]
  }),
  getters: {
    getResponsibilitiesHeaders(state): string[] {
      return state.headers
    },
    getResponsibilities(state): Roles[] {
      return state.responsibilities
    },
    getResponsibilityById(state): Roles {
      return state.responsibility
    },
  },
  actions: {
    async fetchResponsibilities(): Promise<void> {
      this.responsibilities = []
      this.loading = true
      await new ResponsibilitiesService().getResponsibilities().then(
        (response) => {
          this.responsibilities = response.data
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
      this.setHeaders()
    },
    async fetchResponsibility(id: number) {
      this.responsibility = {}
      this.loading = true
      await new ResponsibilitiesService().getResponsibility(id).then(
        (response) => {
          this.responsibility = response.data
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
      await this.fetchResponsibilities()
      this.loading = false
    },
    async newResponsibility(responsibility: Roles) {
      await new ResponsibilitiesService().createResponsibility(responsibility).then(
        () => {
          this.responsibilities.push(responsibility)
          // this.responsibilities.push(<never>response.data)
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
      await this.fetchResponsibilities()
    },
    async deleteResponsibility(item: Roles, id: number) {
      const index = this.responsibilities.indexOf(item)
      await new ResponsibilitiesService().deleteResponsibility(id).then(
        () => {
          this.responsibilities.splice(index, 1)
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
      this.responsibilities = []
    },
    setHeaders() {
      if (this.responsibilities[0]) {
        this.headers = Object.keys(this.responsibilities[0])
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
