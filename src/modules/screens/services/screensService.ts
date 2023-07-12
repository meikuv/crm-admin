import api from '@/services/siebel-gateway'
import { Screens }  from '@/typings'

export default class ScreensService {
  getScreens(): Promise<any> {
    return api.get('/cfg/screens')
  }

  getScreen(id: number): Promise<any> {
    return api.get('/cfg/screens/' + id)
  }

  createScreen(screen: Screens): Promise<any> {
    return api.post('/cfg/screens/', screen)
  }

  deleteScreen(id: number): Promise<any> {
    return api.delete('/cfg/screens/' + id)
  }

  getUsersViews(login: string): Promise<any> {
    return api.get('/users-views?login=' + login)
  }
}
