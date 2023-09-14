import { inject } from '@adonisjs/fold'
import { AirportDTO } from 'App/DTO/Airport'
import { BookingDTO } from 'App/DTO/Booking'
import BookingEntity from 'App/Entities/Booking'
import FlightService from './FlightService'
import { FlightDTO } from 'App/DTO/Flight'
import CurrencyService from './CurrencyService'

@inject()
class BookingService {
  constructor(
    private flightService: FlightService,
    private currencyService: CurrencyService
  ) {}

  public async save(booking: Omit<BookingDTO<string>, 'id'>): Promise<BookingDTO<string>> {
    return BookingEntity.store(booking)
  }

  public async getBookings(page: number = 0, limit: number = 0): Promise<BookingDTO<AirportDTO>[]> {
    const bookings = await BookingEntity.getAll(page, limit)
    const flights = await this.flightService.getFlights()

    return bookings.map((booking) => ({
      ...booking,
      flight: flights.find((f) => f.id === booking.flight_id)!,
    }))
  }

  public async getBooking(id: string): Promise<BookingDTO<AirportDTO> | null> {
    const booking = await BookingEntity.getOne(id)
    if (!booking) return null

    const flight = (await this.flightService.getFlight(booking.flight_id))!

    return {
      ...booking,
      flight,
    }
  }

  public async removeBooking(id: string): Promise<boolean> {
    return BookingEntity.delete(id)
  }

  public getTotalLuggagePrice(
    booking: BookingDTO<string>,
    luggages_limit: number,
    rate: number = this.currencyService.getDefaultCurrency().rate
  ): number {
    let totalLuggagesPrice: number = 0

    const bookingLuggages = booking.luggages * booking.quantity
    const flightLuggagesLimit = luggages_limit * booking.quantity

    if (bookingLuggages > flightLuggagesLimit)
      totalLuggagesPrice = (bookingLuggages - flightLuggagesLimit) * booking.cost_per_more_luggages!

    return totalLuggagesPrice * rate
  }

  public getTotalPrice(
    booking: BookingDTO<string>,
    flight: FlightDTO<AirportDTO | string>,
    rate: number = this.currencyService.getDefaultCurrency().rate
  ): number {
    let totalPrice =
      flight.price * rate + this.getTotalLuggagePrice(booking, flight.luggages_limit, rate)

    const priceToDiscount: number =
      Math.floor(booking.quantity / booking.discount_cond!) * booking.discount! * totalPrice

    return totalPrice - priceToDiscount
  }
}

export default BookingService
