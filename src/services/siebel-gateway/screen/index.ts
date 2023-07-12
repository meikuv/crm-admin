import siebelGatewayHttp from '@/services/siebel-gateway'
import { ISiebelGatewayScreen, ISiebelGatewayUserView } from '@/services/siebel-gateway/screen/interfaces'
import { AxiosResponse } from 'axios'
class SiebelGatewayScreen {
  getScreens(): Promise<AxiosResponse<ISiebelGatewayScreen[]>> {
    return siebelGatewayHttp.request<ISiebelGatewayScreen[]>({
      method: 'GET',
      url: '/cfg/screens',
    })
  }

  getScreen(id: number): Promise<AxiosResponse<ISiebelGatewayScreen>> {
    return siebelGatewayHttp.request<ISiebelGatewayScreen>({
      method: 'GET',
      url: '/cfg/screens/' + id,
    })
  }

  createScreen(screen: ISiebelGatewayScreen): Promise<AxiosResponse<ISiebelGatewayScreen>> {
    return siebelGatewayHttp.request({
      method: 'POST',
      url: '/cfg/screens/',
      data: screen,
    })
  }

  deleteScreen(id: number): Promise<AxiosResponse> {
    return siebelGatewayHttp.request({
      method: 'DELETE',
      url: '/cfg/screens/' + id,
    })
  }

  getUsersViews(login: string): Promise<AxiosResponse<ISiebelGatewayUserView>> {
    return siebelGatewayHttp.request<ISiebelGatewayUserView>({
      method: 'GET',
      url: '/users-views/',
      params: {
        login,
      },
    })
  }
}

const siebelGatewayScreen = new SiebelGatewayScreen()
export default siebelGatewayScreen
