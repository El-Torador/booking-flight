import Env from '@ioc:Adonis/Core/Env'
import superagent from 'superagent'
import { AirportDTO } from 'App/DTO/Airport'

class AirportEntity {
  private static db_uri: string = Env.get('DB_URI')
  private static __tablename__: string = 'airports'

  public static async getAll(page: number, limit: number): Promise<AirportDTO[]> {
    const response = await superagent.get(
      `${this.db_uri}/${this.__tablename__}?_page=${page}&_limit=${limit}`
    )
    return response.body
  }

  public static async getOne(id: string): Promise<AirportDTO | null> {
    const response = await superagent.get(`${this.db_uri}/${this.__tablename__}/${id}`)

    if (response.statusCode === 404) return null
    return response.body
  }
}

export default AirportEntity
