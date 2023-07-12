export interface IAuthenticationData {
  accessToken: string
  errorText: string
  expiryDateTime: string
  refreshToken: string
}

class TokenService {
  getLocalRefreshToken(): string {
    const user = this.getUser()
    return user?.refreshToken
  }

  getLocalAccessToken(): string {
    const user = this.getUser()
    return user?.accessToken
  }

  getUser(): Record<string, string> {
    return JSON.parse(sessionStorage.getItem('user')!)
  }

  getCurrentUser(): string {
    return sessionStorage.getItem('currentUser')!
  }

  setUser(user: IAuthenticationData, username: string): void {
    sessionStorage.setItem('user', JSON.stringify(user))
    sessionStorage.setItem('currentUser', username)
  }

  removeUser(): void {
    sessionStorage.removeItem('user')
    sessionStorage.removeItem('currentUser')
    sessionStorage.removeItem('chosenView')
    sessionStorage.removeItem('chosenTab')
    sessionStorage.removeItem('Tabs')
  }
}

export default new TokenService()
