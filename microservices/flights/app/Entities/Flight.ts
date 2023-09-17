import Env from '@ioc:Adonis/Core/Env'
import superagent from 'superagent'
import { FlightDTO } from 'App/DTO/Flight'

class FlightEntity {
  private static db_uri: string = Env.get('DB_URI')
  private static __tablename__: string = 'flights'
  private static DATA_API_KEY: string = Env.get('DATA_STORE_API_KEY')
  private static DATA_STORE_KEY = 'DATA-STORE-API-KEY'

  public static async getAll(page: number, limit: number): Promise<FlightDTO<string>[]> {
    const response = await superagent
      .get(`${this.db_uri}/${this.__tablename__}?_page=${page}&_limit=${limit}`)
      .set({ [this.DATA_STORE_KEY]: this.DATA_API_KEY })
      .accept('application/json')

    // const totalCount = response.headers['x-total-count']
    return response.body
  }

  public static async getOne(id: string): Promise<FlightDTO<string> | null> {
    const response = await superagent
      .get(`${this.db_uri}/${this.__tablename__}/${id}`)
      .set({ [this.DATA_STORE_KEY]: this.DATA_API_KEY })

    if (response.statusCode === 404) return null
    return response.body
  }
}

export default FlightEntity
