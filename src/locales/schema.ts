import ru from './ru/index'

export type MessageSchema = typeof ru

export type NumberSchema = {
  currency: {
    style: 'currency'
    currencyDisplay: 'symbol'
    currency: string
  }
}
