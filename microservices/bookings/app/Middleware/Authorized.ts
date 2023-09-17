import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import Logger from '@ioc:Adonis/Core/Logger'

export default class Authorized {
  private API_KEY_FLIGHT = Env.get('APP_KEY')
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    const API_KEY = request.header('K4-API-KEY')

    if (!API_KEY) {
      Logger.error(request.ip() + 'unauthorized. Missing K4-API-KEY.')
      response.unauthorized({ mesage: 'Missing K4-API-KEY in your headers.' })
      return
    }

    if (API_KEY !== this.API_KEY_FLIGHT) {
      Logger.error(request.ip() + 'unauthorized. BAD API KEY.')
      response.unauthorized({ message: 'Bad API KEY.' })
      return
    }
    await next()
  }
}
