import { inject } from '@adonisjs/fold'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Logger from '@ioc:Adonis/Core/Logger'
import { BookingDTO } from 'App/DTO/Booking'

import BookingService from 'App/Services/BookingService'
import BookingValidator from 'App/Validators/BookingValidator'

@inject()
export default class BookingController {
  constructor(private bookingService: BookingService) {}

  public async index({ request }: HttpContextContract) {
    const { page, limit, email } = request.qs() as { page: number; limit: number; email: string }

    return this.bookingService.getBookings(page || 0, limit || 0, email)
  }

  public async show({ params, request, response }: HttpContextContract) {
    const queryParams = request.qs()
    const idOrder = params.id as string
    try {
      const booking = await this.bookingService.getBooking(idOrder, queryParams)
      if (!booking) return response.notFound({"message": "Booking not found."})

      return response.ok(booking) 
    } catch (error) {
      Logger.error(error)
      return response.internalServerError({"message": "Something wrong with this process :(."})
    }
  }

  public async create({ request, response }: HttpContextContract) {
    const booking = await request.validate(BookingValidator)
    try {
      return this.bookingService.save(booking as BookingDTO<string>)
    } catch (error) {
      Logger.error(error)
      return response.internalServerError({"message": "Something wrong with this process :(."})
    }
  }

  public async undo({ params }: HttpContextContract) {
    const idOrder = params.id as string

    return this.bookingService.removeBooking(idOrder)
  }

  public async store({ params }: HttpContextContract) {
    const idOrder = params.id as BookingDTO<string>['id']

    return this.bookingService.persit(idOrder)
  }
}
