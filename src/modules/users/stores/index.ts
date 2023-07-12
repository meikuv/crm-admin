import { defineStore } from 'pinia'
import UsersService from '../services/usersService'
import { Users }  from '@//typings'

export const usersStore = defineStore({
  id: 'usersStore',
  state: () => ({
    users: [] as Users[],
    user: {} as Users,
    error: [],
    loading: false,
    headers: [] as string[]
  }),
  getters: {
    getUsers(state): Users[] {
      return state.users
    },
    getUserById(state): Users {
      return state.user
    },
    getHeaders(state) {
      return state.headers
    }
  },
  actions: {
    async fetchUsers(): Promise<void> {
      this.users = []
      this.loading = true
      await new UsersService().getUsers().then(
        (response) => {
          this.users = response.data
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
    async fetchUser(id: number) {
      this.loading = true
      await new UsersService().getUser(id).then(
        (response) => {
          // @ts-ignore
          this.user = (response.data)
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
    async newUser(user: Users) {
      await new UsersService().createUser(user).then(
        () => {
          this.users.push(user)
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
      await this.fetchUsers()
    },

    async deleteUser(item: Users, id: number) {
      const index = this.users.indexOf(item)
      await new UsersService().deleteUser(id).then(
        () => {
          this.users.splice(index, 1)
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
      this.users = []
    },
    setHeaders() {
      if (this.users[0]) {
        this.headers = Object.keys(this.users[0])
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
