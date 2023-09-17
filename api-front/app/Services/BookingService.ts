import Env from '@ioc:Adonis/Core/Env'
import { inject } from '@adonisjs/fold'
import superagent from 'superagent'
import { AirportDTO } from 'App/DTO/Airport'
import { BookingDTO } from 'App/DTO/Booking'

@inject()
class BookingService {
  private booking_api: string = Env.get('API_BOOKING')
  private API_KEY: string = Env.get('API_KEY_BOOKING')
  private K4_API_KEY: string = 'K4-API-KEY'

  /**
   * Create a booking who need to persist and returs order_id
   */
  public async save(booking: BookingDTO<string>): Promise<{ order_id: string }> {
    const response = await superagent
      .post(this.booking_api)
      .send(booking)
      .set({
        [this.K4_API_KEY]: this.API_KEY,
      })

    return response.body
  }

  /**
   * Confirm booking and persist in DB by providing order_id
   */
  public async persit(id: BookingDTO<string | AirportDTO>['id']): Promise<BookingDTO<string>> {
    const response = await superagent.get(`${this.booking_api}/${id}/confirm`).set({
      [this.K4_API_KEY]: this.API_KEY,
    })
    return response.body
  }

  public async getBookings(
    page: number = 0,
    limit: number = 0,
    email?: BookingDTO<string | AirportDTO>['email_guest']
  ): Promise<BookingDTO<AirportDTO>[]> {
    const endpoint = `${this.booking_api}?page=${page}&limit=${limit}${
      email ? `&email=${email}` : ''
    }`

    const response = await superagent.get(endpoint).set({
      'K4-API-KEY': this.API_KEY,
    })
    return response.body
  }

  public async getBooking(
    id: BookingDTO<string | AirportDTO>['id'],
    qs: Record<string, any>
  ): Promise<BookingDTO<AirportDTO> | null> {
    const endpoint = `${this.booking_api}/${id}${qs?.currency ? `?currency=${qs.currency}` : ''}`

    const resp = await superagent.get(endpoint).set({
      'K4-API-KEY': this.API_KEY,
    })

    return resp.body
  }

  public async removeBooking(id: BookingDTO<string | AirportDTO>['id']): Promise<boolean> {
    const resp = await superagent.delete(`${this.booking_api}/${id}`).set({
      'K4-API-KEY': this.API_KEY,
    })
    return !!resp.text
  }
}

export default BookingService
