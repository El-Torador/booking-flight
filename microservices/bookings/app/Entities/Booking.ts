import Env from '@ioc:Adonis/Core/Env'
import superagent from 'superagent'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { BookingDTO } from 'App/DTO/Booking'
import { AirportDTO } from 'App/DTO/Airport'

class BookingEntity {
  private static db_uri: string = Env.get('DB_URI')
  private static __tablename__: string = 'bookings'
  private static DATA_API_KEY: string = Env.get('DATA_STORE_API_KEY')
  private static DATA_STORE_KEY = 'DATA-STORE-API-KEY'

  public static async store(booking: Omit<BookingDTO<string>, 'id'>): Promise<BookingDTO<string>> {
    const response = await superagent
      .post(`${this.db_uri}/${this.__tablename__}`)
      .set({ [this.DATA_STORE_KEY]: this.DATA_API_KEY })
      .send({ id: cuid(), ...booking })

    return response.body
  }

  public static async getAll(
    page: number,
    limit: number,
    email?: BookingDTO<string | AirportDTO>['email_guest']
  ): Promise<BookingDTO<string>[]> {
    const response = await superagent
      .get(
        `${this.db_uri}/${this.__tablename__}?_page=${page}&_limit=${limit}${
          email ? `&email_guest=${email}` : ''
        }`
      )
      .set({ [this.DATA_STORE_KEY]: this.DATA_API_KEY })
    return response.body
  }

  public static async getOne(id: string): Promise<BookingDTO<string> | null> {
    const response = await superagent
      .get(`${this.db_uri}/${this.__tablename__}/${id}`)
      .set({ [this.DATA_STORE_KEY]: this.DATA_API_KEY })

    if (response.statusCode === 404) return null

    return response.body
  }

  public static async delete(id: string): Promise<boolean> {
    const response = await superagent
      .delete(`${this.db_uri}/${this.__tablename__}/${id}`)
      .set({ [this.DATA_STORE_KEY]: this.DATA_API_KEY })
    return response.ok
  }
}

export default BookingEntity
