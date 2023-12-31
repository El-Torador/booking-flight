import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import FlightService from 'App/Services/FlightService'
import Redis from '@ioc:Adonis/Addons/Redis'

@inject()
export default class FlightsController {
  constructor(private flightService: FlightService) {}

  public async index({ request }: HttpContextContract) {
    const { page, limit } = request.qs()
    return this.flightService.getFlights(page || 0, limit || 0)
  }

  public async getCurrentSeatsFlight({ params, response }: HttpContextContract) {
    const id = params.id as string

    if (!id) return response.badRequest()

    const flight = await this.flightService.getFlight(id)

    if (!flight) return response.notFound()

    const restSeats = await Redis.get(flight.id)

    if (!restSeats) return response.ok(flight.seats)

    return response.ok(+restSeats)
  }

  public async show({ params }: HttpContextContract) {
    const id = params.id as string
    return this.flightService.getFlight(id)
  }

  public async getCostPerLuggages() {
    return this.flightService.getCostPerLuggages()
  }
}
