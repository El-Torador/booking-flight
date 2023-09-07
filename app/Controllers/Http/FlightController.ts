import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { inject } from '@adonisjs/fold'
import FlightService from 'App/Services/FlightService'

@inject()
export default class FlightController {
  constructor(private flightService: FlightService) {}

  public async getAll({ request }: HttpContextContract) {
    console.log(request.headers())

    return this.flightService.getFlights()
  }
}
