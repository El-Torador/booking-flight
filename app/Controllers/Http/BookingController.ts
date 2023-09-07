import { inject } from '@adonisjs/fold'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import BookingService from 'App/Services/BookingService'
import FlightService from 'App/Services/FlightService'
import BookingValidator from 'App/Validators/BookingValidator'

@inject()
export default class BookingController {
  constructor(
    private bookingService: BookingService,
    private flightService: FlightService
  ) {}

  public async store({ request, response }: HttpContextContract) {
    const booking = await request.validate(BookingValidator)

    if (!this.flightService.getFlight(booking.flight_id))
      return response.notFound({ message: "Flight doesn't exist." })

    return await this.bookingService.postBooking(booking)
  }
}
