import Env from '@ioc:Adonis/Core/Env'
import Redis from '@ioc:Adonis/Addons/Redis'
import superagent from 'superagent'
import xml2jsParser from 'superagent-xml2jsparser'
import { DateTime } from 'luxon'

let lastTimeCached: number

class CurrencyService {
  private endpoint: string = Env.get('CURRENCY_API')

  private setLastTimeCached(value: number): void {
    lastTimeCached = value
  }
  private parseDataJson(data: {}[]) {
    return data.map((v) => {
      return {
        ...v['$'],
        rate: +v['$']['rate'],
      }
    })
  }

  public async getCurrencies() {
    if (lastTimeCached && DateTime.fromMillis(Date.now() - lastTimeCached).hour < 24) {
      console.info('GET CURRENCY FROM CACHE...')
      const data = (await Redis.get(lastTimeCached.toString())) as string

      return JSON.parse(data)
    }
    console.info('RENEW CACHE CURRENCY...')

    try {
      const response = await superagent
        .get(this.endpoint)
        .accept('xml')
        .parse(xml2jsParser)
        .buffer(true)
      const data = response.body

      this.setLastTimeCached(DateTime.now().toMillis())

      const value = this.parseDataJson(
        data['gesmes:Envelope']['Cube'][0]['Cube'][0]['Cube']
      ) as Record<string, {}>[]

      await Redis.set(lastTimeCached.toString(), JSON.stringify(value))

      return value
    } catch (error) {
      console.error(error)
      return JSON.parse((await Redis.get(lastTimeCached.toString())) as string)
    }
  }
}

export default CurrencyService
