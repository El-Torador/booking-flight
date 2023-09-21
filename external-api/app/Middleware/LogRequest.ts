import Logger from '@ioc:Adonis/Core/Logger'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LogRequest {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    Logger.info(
      `${request.method()} ${request.protocol()}://${request.hostname()}=>${request.ip()} ${request.url()}`
    )
    await next()
  }
}
