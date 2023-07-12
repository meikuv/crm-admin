import api from '@/services/siebel-gateway'
import { Views }  from '@/typings'

export default class ViewsService {
  async getViews(): Promise<any> {
    return await api.get('/cfg/views')
  }

  async getView(id: number): Promise<Views> {
    return await api.get('/cfg/views/' + id)
  }

  async createView(view: Views): Promise<void> {
    return await api.post('/cfg/views/', view)
  }

  async addViewResp(view: Views): Promise<Views> {
    return await api.post('/cfg/views/', view)
  }

  async deleteView(id: number): Promise<Views> {
    return await api.delete('/cfg/views/' + id)
  }
}
