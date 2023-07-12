import ContentType from '@/utils/dictionaries/contentType'
import axios, { AxiosRequestConfig } from 'axios'
import TokenService from '@/modules/authorization/services/token.service'
import { authorizationModuleStore } from '@/modules/authorization/stores'
import router from '@/router'

const gatewayUrl = import.meta.env.VITE_SIEBEL_GATEWAY_URL
const reqTimeout = parseInt(import.meta.env.VITE_APP_REQUEST_TIMEOUT, 10)

const siebelGatewayHttp = axios.create({
  baseURL: gatewayUrl,
  timeout: reqTimeout,
  headers: {
    'Content-Type': ContentType.JSON,
  },
})

siebelGatewayHttp.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    if (config.headers === undefined) config.headers = {}
    const token: string = TokenService.getLocalAccessToken()
    if (token) {
      config.headers.Authorization = 'Bearer ' + token
    }
    // TODO: раскомментировать после того как заголовок разрешат на сервере
    // config.headers.AcceptLanguage = sessionStorage.getItem('chosenLanguage') || 'ru'
    return config
  },
  error => {
    return Promise.reject(error)
  },
)

siebelGatewayHttp.interceptors.response.use(
  res => {
    return res
  },
  async err => {
    const originalConfig = err.config
    const authStore = authorizationModuleStore()

    if (originalConfig.url !== `${gatewayUrl}/auth/login` && err.response) {
      // Access Token was expired
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true
        try {
          const rs = await siebelGatewayHttp.post(`${gatewayUrl}/auth/refresh-token`, {
            refreshToken: TokenService.getLocalRefreshToken(),
          })
          TokenService.setUser(rs.data, TokenService.getCurrentUser())
          authStore.refreshToken()
          return siebelGatewayHttp(originalConfig)
        } catch (_error) {
          authStore.logout()
          router.push('/login')
          return Promise.reject(_error)
        }
      }
    }

    return Promise.reject(err)
  },
)

export default siebelGatewayHttp
