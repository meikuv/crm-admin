import api from '@/services/siebel-gateway'
import {Roles} from '@/typings'


export default class ResponsibilitiesService {
  async getResponsibilities(): Promise<any> {
    return await api.get('/cfg/responsibilities/')
  }

  async getResponsibility(id: number): Promise<any> {
    return await api.get('/cfg/responsibilities/' + id)
  }

  async createResponsibility(resp: Roles): Promise<void> {
    return await api.post('/cfg/responsibilities/', resp)
  }

  async deleteResponsibility(id: number): Promise<Roles> {
    return await api.delete('/cfg/responsibilities/' + id)
  }
}
