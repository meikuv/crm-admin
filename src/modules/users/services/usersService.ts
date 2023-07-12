import api from '@/services/siebel-gateway/index'
import { Users }  from '@//typings'

export default class UsersService {
  async getUsers(): Promise<any> {
    return await api.get('/cfg/users')
  }

  async getUser(id: number): Promise<Users> {
    return await api.get('/cfg/users/' + id)
  }

  async createUser(user: Users): Promise<void> {
    return await api.post('/cfg/users/', user)
  }

  async addUserResp(user: Users): Promise<Users> {
    return await api.post('/cfg/users/', user)
  }

  async deleteUser(id: number): Promise<Users> {
    return await api.delete('/cfg/users/' + id)
  }
}
