import Env from '@ioc:Adonis/Core/Env'
import { inject } from '@adonisjs/fold'
import superagent from 'superagent'
import { AirportDTO } from 'App/DTO/Airport'
import { BookingDTO } from 'App/DTO/Booking'
import { Passenger } from 'App/DTO/Passenger'
import Logger from '@ioc:Adonis/Core/Logger'

export interface ExternalBooking {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  flightId: string;
  vege: boolean;
  price: number;
  currency: string;
}

@inject()
class BookingService {
  private booking_api: string = Env.get('API_BOOKING')
  private API_KEY: string = Env.get('API_KEY_BOOKING')
  private K4_API_KEY: string = 'K4-API-KEY'

  private external_booking_api: string
  private TOKEN_EXTERNAL_BOOKING_API: string
  private KEY_TOKEN: string

  private mappingKeys = {
    'id': 'id',
    'email': 'email_guest',
    'flightId': 'flight_id',
    'price': 'price',
    'currency': 'currency',
    'vege': 'vege'
  }

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
    //TODO: GET BOOKINGS FROM OTHER AIRLINE
    const response = await superagent.get(endpoint).set({
      [this.K4_API_KEY]: this.API_KEY,
    })
    return response.body
  }

  public async getBooking(
    id: BookingDTO<string | AirportDTO>['id'],
    qs: Record<string, any>
  ): Promise<BookingDTO<AirportDTO> | null> {
    const endpoint = `${this.booking_api}/${id}${qs?.currency ? `?currency=${qs.currency}` : ''}`

    const resp = await superagent.get(endpoint).set({
      [this.K4_API_KEY]: this.API_KEY,
    })

    return resp.body
  }

  public async removeBooking(id: BookingDTO<string | AirportDTO>['id']): Promise<boolean> {
    const resp = await superagent.delete(`${this.booking_api}/${id}`).set({
      [this.K4_API_KEY]: this.API_KEY,
    })
    return !!resp.text
  }

  private serializeExternalBooking(booking: ExternalBooking): BookingDTO<string> {
    const passenger = {} as Passenger
    const data = Object.keys(booking).reduce((prev, key) => {
      if (key === 'firstname' || key === 'lastname') {
        passenger[key] = booking[key]
      }else if (key in this.mappingKeys){
        prev[this.mappingKeys[key]] = booking[key]
      }else{
        throw new Error('Schema doest match')
      }

      return prev
    }, {} as BookingDTO<string>)
    data.passengers = [passenger]
    return data
  }

  public async getExternalBookings(): Promise<BookingDTO<string>[]> {
    try {
      const response = await superagent.get(`${this.external_booking_api}/booking`).set({
        [this.KEY_TOKEN]: this.TOKEN_EXTERNAL_BOOKING_API
      })

      const externalBookings = response.body as ExternalBooking[]
      return externalBookings.map(externalBooking => this.serializeExternalBooking(externalBooking))
    } catch (error) {
      Logger.error(error)
      return []
    }
  }
}

export default BookingService
