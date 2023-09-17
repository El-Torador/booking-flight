import Env from '@ioc:Adonis/Core/Env'
import superagent from 'superagent'
import { inject } from '@adonisjs/fold'
import { FlightDTO } from 'App/DTO/Flight'
import { AirportDTO } from 'App/DTO/Airport'

@inject()
class FlightService {
  private flight_api: string = Env.get('API_FLIGHT')
  private API_KEY: string = Env.get('API_KEY_FLIGHT')
  public async getFlights(page: number = 0, limit: number = 0): Promise<FlightDTO<AirportDTO>[]> {
    const response = await superagent
      .get(`${this.flight_api}?page=${page}&limit=${limit}`)
      .set({
        'K4-API-KEY': this.API_KEY,
      })
      .accept('application/json')

    return response.body
  }

  public async getFlight(
    id: FlightDTO<string | AirportDTO>['id']
  ): Promise<FlightDTO<AirportDTO> | null> {
    const resp = await superagent.get(`${this.flight_api}/${id}`).set({
      'K4-API-KEY': this.API_KEY,
    })
    return resp.body
  }

  public async getCostPerLuggages(): Promise<number> {
    const response = await superagent.get(`${this.flight_api}/costLuggage`).set({
      'K4-API-KEY': this.API_KEY,
    })
    return +response.text
  }

  public async getRestSeatsFlight(id: FlightDTO<string | AirportDTO>['id']): Promise<number> {
    const resp = await superagent.get(`${this.flight_api}/${id}/getRestPlace`).set({
      'K4-API-KEY': this.API_KEY,
    })

    return +resp.text
  }
}

export default FlightService
