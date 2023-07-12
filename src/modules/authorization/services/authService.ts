import siebelGatewayHttp from '@/services/siebel-gateway'
import TokenService from '@/modules/authorization/services/token.service'
class AuthService {
  login(user: Record<string, string>): Record<any, any> {
    return siebelGatewayHttp
      .post('/auth/login', {
        login: user.username,
        password: user.password,
      })
      .then(response => {
        if (response.data.accessToken) {
          TokenService.setUser(response.data, user.username)
        }
        return response.data
      })
  }

  logout(): void {
    TokenService.removeUser()
  }
}
export default new AuthService()
