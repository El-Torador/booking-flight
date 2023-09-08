import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import FlightService from 'App/Services/FlightService'
import Redis from '@ioc:Adonis/Addons/Redis'

@inject()
export default class FlightController {
  constructor(private flightService: FlightService) {}

  public async getAll() {
    return this.flightService.getFlights()
  }
  public async getCurrentPlaceFlight({ params, response }: HttpContextContract) {
    const id = params.id as string

    if (!id) return response.badRequest()

    const flight = this.flightService.getFlight(id)

    if (!flight) return response.notFound()

    const restPlaces = await Redis.get(flight.id)

    if (!restPlaces) return response.ok(flight.places)

    return response.ok(+restPlaces)
  }

  public async getCostPerLuggages() {
    return this.flightService.getCostPerLuggages()
  }
}
