export interface ISiebelGatewayRole {
  id: number
  name: string
  description: string
}

export interface ISiebelGatewayView {
  id: number
  name: string
  orderField: number
  roles: ISiebelGatewayRole[]
  routeName: string
}

export interface ISiebelGatewayScreen {
  id: number
  name: string
  orderField: number
  views: ISiebelGatewayView[]
}

export interface ISiebelGatewayUserView {
  cfgScreens: ISiebelGatewayScreen[]
  login: string
  roles: ISiebelGatewayRole[]
}
