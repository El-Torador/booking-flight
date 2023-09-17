import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'

export default class LogRequest {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    Logger.info(
      `${request.method()} ${request.protocol()}://${request.hostname()}=>${request.ip()} ${request.url()}`
    )
    // code for middleware goes here. ABOVE THE NEXT CALL
    await next()
  }
}
