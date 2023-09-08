import { DateTime } from 'luxon'
import { inject } from '@adonisjs/fold'
import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BookingDTO } from 'App/DTO/Booking'

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
    const booking = (await request.validate(BookingValidator)) as unknown as Omit<BookingDTO, 'id'>
    if (DateTime.now().toMillis() <= booking.date_departiture) return response.badRequest()

    const isFlight = this.flightService.getFlight(booking.flight_id)

    if (!isFlight) return response.notFound({ message: "Flight doesn't exist." })

    const restPlaces = await Redis.get(isFlight.id)

    if (restPlaces && +restPlaces <= 0) return response.notAcceptable()

    const lastRestPlace = await Redis.get(isFlight.id)
    if (!lastRestPlace) await Redis.set(isFlight.id, isFlight.places - 1)
    else await Redis.set(isFlight.id, +lastRestPlace - 1)

    return await this.bookingService.postBooking(booking)
  }
}
