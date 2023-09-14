import Env from '@ioc:Adonis/Core/Env'
import superagent from 'superagent'
import { FlightDTO } from 'App/DTO/Flight'

class FlightEntity {
  private static db_uri: string = Env.get('DB_URI')
  private static __tablename__: string = 'flights'

  public static async getAll(page: number, limit: number): Promise<FlightDTO<string>[]> {
    const response = await superagent
      .get(`${this.db_uri}/${this.__tablename__}?_page=${page}&_limit=${limit}`)
      .accept('application/json')

    // const totalCount = response.headers['x-total-count']
    return response.body
  }

  public static async getOne(id: string): Promise<FlightDTO<string> | null> {
    const response = await superagent.get(`${this.db_uri}/${this.__tablename__}/${id}`)

    if (response.statusCode === 404) return null
    return response.body
  }
}

export default FlightEntity
