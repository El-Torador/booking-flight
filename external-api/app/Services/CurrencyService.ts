import Env from '@ioc:Adonis/Core/Env'
import superagent from 'superagent'

export interface Currency {
  currency: string
  rate: number
}
class CurrencyService {
  private booking_api: string = Env.get('API_CURRENCY')
  private API_KEY: string = Env.get('API_KEY_BOOKING')
  private K4_API_KEY: string = 'K4-API-KEY'

  public async getCurrencies(): Promise<Currency[]> {
    const response = await superagent.get(`${this.booking_api}`).set({
      [this.K4_API_KEY]: this.API_KEY,
    })
    return response.body
  }
}

export default CurrencyService
