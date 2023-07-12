export interface Roles {
  id?: number,
  name?: string,
  description?: string
}
export interface Users {
  id?: number,
  login?: string,
  roles?: Roles[]
}
export interface Views {
  id?: number,
  name: string | number,
  routeName?: string,
  roles?: Roles[]
}

export interface Screens {
  id?: number,
  name: string | number,
  code?: string,
  views: Views[]
}

export interface User {
  accessToken?: string,
  refreshToken?: string,
  errorText?: string,
  expiryDateTime?: string,
  username?: string,
  password?: string
}

