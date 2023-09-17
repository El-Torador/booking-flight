import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import FlightService from 'App/Services/FlightService'

@inject()
export default class FlightController {
  constructor(private flightService: FlightService) {}

  public async index({ request }: HttpContextContract) {
    const { page, limit } = request.qs()

    return this.flightService.getFlights(page || 0, limit || 0)
  }

  public async getCurrentSeatsFlight({ params, response }: HttpContextContract) {
    const id = params.id as string

    if (!id) return response.badRequest()

    return this.flightService.getRestSeatsFlight(id)
  }

  public async show({ params, response }: HttpContextContract) {
    const id = params.id as string
    if (!id) return response.badRequest()

    return this.flightService.getFlight(id)
  }

  public async getCostPerLuggages() {
    return this.flightService.getCostPerLuggages()
  }
}
