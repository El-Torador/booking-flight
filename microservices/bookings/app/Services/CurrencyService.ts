import Logger from '@ioc:Adonis/Core/Logger'
import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'
import superagent from 'superagent'
import xml2jsParser from 'superagent-xml2jsparser'
import { DateTime } from 'luxon'

let lastTimeCached: number

export interface Currency {
  currency: string
  rate: number
}
class CurrencyService {
  private endpoint: string = Env.get('CURRENCY_API')

  private setLastTimeCached(value: number): void {
    lastTimeCached = value
  }
  private parseDataJson(data: {}[]): Currency[] {
    return data.map((v) => {
      return {
        ...v['$'],
        rate: +v['$']['rate'],
      }
    })
  }

  public getDefaultCurrency(): Currency {
    return {
      currency: 'EUR',
      rate: 1,
    }
  }
  public async getCurrencies(): Promise<Currency[]> {
    let tmpData: string | null = null

    if (lastTimeCached && DateTime.fromMillis(Date.now() - lastTimeCached).hour < 24) {
      Logger.info('GET CURRENCY FROM CACHE...')

      const data = await Redis.get(lastTimeCached.toString())
      tmpData = data

      if (data) return JSON.parse(data)
    }

    Logger.info('RENEW CACHE CURRENCY...')

    try {
      const response = await superagent
        .get(this.endpoint)
        .accept('xml')
        .parse(xml2jsParser)
        .buffer(true)
      if (!response.ok) throw new Error('Error Occured when getting currencies.')
      const data = response.body

      const currencies = this.parseDataJson(data['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube'])

      currencies.unshift(this.getDefaultCurrency())

      if (lastTimeCached && tmpData) await Redis.del(lastTimeCached.toString())
      this.setLastTimeCached(DateTime.now().toMillis())

      await Redis.set(lastTimeCached.toString(), JSON.stringify(currencies))

      return currencies
    } catch (error) {
      Logger.error(error)
      if (!lastTimeCached) throw new Error(error.message)

      const currencies = await Redis.get(lastTimeCached?.toString())
      if (!currencies) throw new Error(error.message)

      return JSON.parse(currencies) as Currency[]
    }
  }

  public async getCurrenciesMapper(): Promise<Map<string, Currency>> {
    const currencies = await this.getCurrencies()
    const map = new Map<string, Currency>()
    currencies.forEach((currency) => {
      map.set(currency.currency, currency)
    })

    return map
  }

  public searchCurrency(currencyMap: Map<string, Currency>, currency: string): Currency {
    return currencyMap.get(currency.toUpperCase()) ?? this.getDefaultCurrency()
  }
}

export default CurrencyService
