import Env from '@ioc:Adonis/Core/Env'
import superagent from 'superagent'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import { BookingDTO } from 'App/DTO/Booking'

class BookingEntity {
  private static db_uri: string = Env.get('DB_URI')
  private static __tablename__: string = 'bookings'

  public static async store(booking: Omit<BookingDTO<string>, 'id'>): Promise<BookingDTO<string>> {
    const response = await superagent
      .post(`${this.db_uri}/${this.__tablename__}`)
      .send({ id: cuid(), ...booking })

    return response.body
  }

  public static async getAll(page: number, limit: number): Promise<BookingDTO<string>[]> {
    const response = await superagent.get(
      `${this.db_uri}/${this.__tablename__}?_page=${page}&_limit=${limit}`
    )
    return response.body
  }

  public static async getOne(id: string): Promise<BookingDTO<string> | null> {
    const response = await superagent.get(`${this.db_uri}/${this.__tablename__}/${id}`)

    if (response.statusCode === 404) return null

    return response.body
  }

  public static async delete(id: string): Promise<boolean> {
    const response = await superagent.delete(`${this.db_uri}/${this.__tablename__}/${id}`)
    return response.ok
  }
}

export default BookingEntity
