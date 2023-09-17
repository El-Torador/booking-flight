import Env from '@ioc:Adonis/Core/Env'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { DateTime } from 'luxon'
import { inject } from '@adonisjs/fold'
import Redis from '@ioc:Adonis/Addons/Redis'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { BookingDTO } from 'App/DTO/Booking'

import BookingService from 'App/Services/BookingService'
import FlightService from 'App/Services/FlightService'
import BookingValidator from 'App/Validators/BookingValidator'
import CurrencyService from 'App/Services/CurrencyService'
import { formatCurrency, formatDate } from 'App/utils'

@inject()
export default class BookingsController {
  private discount_qte_ticket_cond: number = Env.get('DISCOUNT_QTE_TICKET_COND')
  private discount_qte_ticket_percent: number = Env.get('DISCOUNT_QTE_TICKET_PERCENT')

  constructor(
    private bookingService: BookingService,
    private flightService: FlightService,
    private currencyService: CurrencyService
  ) {}

  public async index({ request }: HttpContextContract) {
    const { page, limit, email } = request.qs() as { page: number; limit: number; email: string }

    const bookings = await this.bookingService.getBookings(page || 0, limit || 0, email)

    return bookings.map((booking) => ({
      ...booking,
      flight: {
        ...booking.flight,
        price: formatCurrency(booking.flight!.price * booking.currency_rate!, booking.currency),
      },
      date_departiture: formatDate(booking.date_departiture),
      total_luggages_price: formatCurrency(
        this.bookingService.getTotalLuggagePrice(
          JSON.parse(JSON.stringify(booking)) as BookingDTO<string>,
          booking.flight!.luggages_limit,
          booking.currency_rate
        ),
        booking.currency
      ),
      total_price: formatCurrency(
        this.bookingService.getTotalPrice(
          JSON.parse(JSON.stringify(booking)) as BookingDTO<string>,
          booking.flight!,
          booking.currency_rate
        ),
        booking.currency
      ),
    }))
  }

  public async show({ params, request, response }: HttpContextContract) {
    const queryParams = request.qs()

    if (Object.keys(queryParams).length && !('currency' in queryParams))
      return response.badRequest({ message: 'Incorrect query params. Use "currency" instead !' })

    const idOrder = params.id as BookingDTO<string>['id']
    const order = (await Redis.get(idOrder)) || (await this.bookingService.getBooking(idOrder))

    if (!order) return response.notFound({ message: 'This booking does not exists.' })

    const data = JSON.parse(
      typeof order === 'string' ? order : JSON.stringify(order)
    ) as BookingDTO<string>
    const flight = await this.flightService.getFlight(data.flight_id)

    if (!flight) return response.notFound({ message: 'The flight of this order does not exists.' })

    const currenciesMap = await this.currencyService.getCurrenciesMapper()
    const curr = queryParams?.currency as string | null

    if (curr && !currenciesMap.has(curr))
      return response.badRequest({ message: `K\u2074 API does not support ${curr} currency.` })

    const currency = curr
      ? this.currencyService.searchCurrency(currenciesMap, curr)
      : data.currency_rate
      ? { currency: data.currency, rate: data.currency_rate }
      : this.currencyService.getDefaultCurrency()

    return this.bookingService.dataBuilderFormatter(data, flight, currency)
  }

  public async create({ request, response }: HttpContextContract) {
    const booking = await request.validate(BookingValidator)
    if (booking.currency && !isNaN(+booking.currency))
      return response.badRequest({ message: 'Bad currency' })
    const SEATS_NOT_ENOUGH = 'The rest of seats of this flight cannot meet your quantity.'

    if (booking.quantity < 1)
      return response.badRequest({ message: 'Bad quantity. It must greater than 0 !' })

    if (DateTime.fromMillis(booking.date_departiture).diffNow().toMillis() <= 0)
      return response.badRequest({ message: 'Bad date_departiture.' })

    const isFlight = await this.flightService.getFlight(booking.flight_id)

    if (!isFlight) return response.notFound({ message: "Flight doesn't exists." })

    const restPlaces = await Redis.get(isFlight.id)

    if (restPlaces) {
      if (+restPlaces <= 0 || +restPlaces < booking.quantity)
        return response.notAcceptable({ message: SEATS_NOT_ENOUGH })

      await Redis.set(isFlight.id, +restPlaces - booking.quantity)
    } else {
      if (isFlight.seats < booking.quantity)
        return response.notAcceptable({
          message: SEATS_NOT_ENOUGH,
        })

      await Redis.set(isFlight.id, isFlight.seats - booking.quantity)
    }

    const uuid = cuid()
    let discount: number = 0
    let discountCond: number = 0

    if (booking.quantity >= this.discount_qte_ticket_cond) {
      discount = this.discount_qte_ticket_percent
      discountCond = this.discount_qte_ticket_cond
    }

    const currencyMap = await this.currencyService.getCurrenciesMapper()
    const currency = booking.currency ?? this.currencyService.getDefaultCurrency().currency

    await Redis.set(
      uuid,
      JSON.stringify({
        ...booking,
        currency,
        currency_rate: this.currencyService.searchCurrency(currencyMap, currency).rate,
        discount,
        discount_cond: discountCond,
        cost_per_more_luggages: await this.flightService.getCostPerLuggages(),
      })
    )

    return response.created({ order_id: uuid })
  }

  public async undo({ params, response }: HttpContextContract) {
    const idOrder = params.id as BookingDTO<string>['id']

    const order = (await Redis.get(idOrder)) || (await this.bookingService.getBooking(idOrder))

    if (!order) return response.notFound({ message: 'This booking does exists.' })

    if (typeof order === 'string') await Redis.del(idOrder)
    else await this.bookingService.removeBooking(order.id)

    return response.accepted(true)
  }

  public async store({ params, response }: HttpContextContract) {
    const idOrder = params.id as BookingDTO<string>['id']

    const order = await Redis.get(idOrder)

    if (!order) return response.notFound()

    await Redis.del(idOrder)

    return this.bookingService.save(JSON.parse(order) as BookingDTO<string>)
  }
}
