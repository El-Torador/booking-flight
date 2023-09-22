import Env from '@ioc:Adonis/Core/Env'
import superagent from 'superagent'
import { inject } from '@adonisjs/fold'
import { FlightDTO } from 'App/DTO/Flight'
import { AirportDTO } from 'App/DTO/Airport'
import Logger from '@ioc:Adonis/Core/Logger';

export type ExternalFlight = {
    id: string;
    route: string[];
    date: string
    price: number;
    seats: number;
    remainingSeats: number;
    menuVege: boolean;
    company: string
}

@inject()
class FlightService {
  private flight_api: string = Env.get('API_FLIGHT')
  private API_KEY: string = Env.get('API_KEY_FLIGHT')
  private K4_API_KEY: string = 'K4-API-KEY'

  private external_flight_api: string = Env.get('EXTERNAL_FLIGHT_API')
  private TOKEN_EXTERNAL_FLIGHT_API: string = Env.get("TOKEN_EXTERNAL_FLIGHT_API")
  private KEY_TOKEN: string = 'access-token'

  private mappingKeysExternal = {
    'id': 'id',
    'date': 'date',
    'seats': 'seats',
    'price': 'price',
    'remainingSeats': 'remainingSeats',
    'menuVege': 'menuVege',
    'company': 'airline'
  }

  private serializeExternalFlight(flight: ExternalFlight): FlightDTO<string> {
    
    return Object.keys(flight).reduce<FlightDTO<string>>((prev, key) => {
      if (key === 'route') {
        prev.airport_departiture = flight[key].shift()!
        prev.airport_destination = flight[key].pop()!
        prev.stopover = flight[key]
        prev.luggages_limit = 0
      }else if (key in this.mappingKeysExternal){
        prev[this.mappingKeysExternal[key]] = flight[key]
      }else{
        throw new Error('Schema doest match data from external API: '+ prev.airline || "Temps partiel")
      }

      return prev
    }, {} as FlightDTO<string>)
  }

  public async getExternalFlights(): Promise<FlightDTO<string>[]>{
    try {
      const response = await superagent.get(`${this.external_flight_api}/flight`).set({
        [this.KEY_TOKEN]: this.TOKEN_EXTERNAL_FLIGHT_API
      })

      const externalFlights = response.body as ExternalFlight[]

      return externalFlights.map(externalFlight => this.serializeExternalFlight(externalFlight))
    } catch (error) {
      Logger.error(error)
      return []
    }
  }

  public async getExternalFlight(id: string): Promise<FlightDTO<string> | null> {
    try {
      const response = await superagent.get(`${this.external_flight_api}/flight/id=${id}`).set({
        [this.KEY_TOKEN]: this.TOKEN_EXTERNAL_FLIGHT_API
      })

      const externalFlight = response.body as ExternalFlight
      
      return this.serializeExternalFlight(externalFlight)
    } catch (error) {
      Logger.error(error)
      return null
    }
  }

  public async getFlights(page: number = 0, limit: number = 0): Promise<FlightDTO<AirportDTO>[]> {
    const response = await superagent
      .get(`${this.flight_api}?page=${page}&limit=${limit}`)
      .set({
        [this.K4_API_KEY]: this.API_KEY,
      })
      .accept('application/json')
    return response.body
  }


  public async getFlight(
    id: FlightDTO<string | AirportDTO>['id']
  ): Promise<FlightDTO<AirportDTO | string> | null> {
    const resp = await superagent.get(`${this.flight_api}/${id}`).set({
      [this.K4_API_KEY]: this.API_KEY,
    })

    return resp.body
  }

  public async getCostPerLuggages(): Promise<number> {
    const response = await superagent.get(`${this.flight_api}/costLuggage`).set({
      [this.K4_API_KEY]: this.API_KEY,
    })

    return +response.text
  }

  public async getRestSeatsFlight(id: FlightDTO<string | AirportDTO>['id']): Promise<number> {
    const resp = await superagent.get(`${this.flight_api}/${id}/getRestPlace`).set({
      [this.K4_API_KEY]: this.API_KEY,
    })

    return +resp.text
  }
}

export default FlightService
