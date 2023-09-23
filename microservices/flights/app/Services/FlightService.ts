import Env from '@ioc:Adonis/Core/Env'
import { inject } from '@adonisjs/fold'
import { FlightDTO } from 'App/DTO/Flight'
import FlightEntity from 'App/Entities/Flight'
import AirportService from './AirportService'
import { AirportDTO } from 'App/DTO/Airport'
import superagent from 'superagent'


@inject()
class FlightService {
  private cost_per_more_luggages: number = Env.get('COST_PER_MORE_LUGGAGES')
  private EXTERNAL_API: string = Env.get('EXTERNAL_API')
  private EXTERNAL_API_KEY: string = Env.get('EXTERNAL_API_KEY')
  private K4_API_KEY: string = 'K4-API-KEY'

  constructor(private airportService: AirportService) {}
  private async getExternalFlights(): Promise<FlightDTO<AirportDTO>[]> {
    const res = await superagent.get(`${this.EXTERNAL_API}/all`).set({
      [this.K4_API_KEY]: this.EXTERNAL_API_KEY
    })

    return res.body
  }

  private async getExternalFlight(id: string): Promise<FlightDTO<AirportDTO> | null> {
    const res = await superagent.get(`${this.EXTERNAL_API}/${id}`).set({
      [this.K4_API_KEY]: this.EXTERNAL_API_KEY
    })

    return res.body
  }

  public async getFlights(page: number = 0, limit: number = 0): Promise<FlightDTO<AirportDTO>[]> {
    const flights = await FlightEntity.getAll(page, limit)
    const airports = await this.airportService.getAll()
    const externalFlights = await this.getExternalFlights()

    return [...flights.map((flight) => ({
      ...flight,
      airport_departiture: airports.find((a) => a.id === flight.airport_departiture)!,
      airport_destination: airports.find((a) => a.id === flight.airport_destination)!,
    })), ...externalFlights]
  }

  public async getFlight(id: string): Promise<FlightDTO<AirportDTO> | null> {
    const flight = await FlightEntity.getOne(id)
    if (!flight) {
      return this.getExternalFlight(id)
    }

    const apDp = await this.airportService.getAirport(flight.airport_departiture)
    const apDes = await this.airportService.getAirport(flight.airport_destination)

    return {
      ...flight,
      airport_departiture: apDp!,
      airport_destination: apDes!,
    }
  }

  public getCostPerLuggages(): number {
    return this.cost_per_more_luggages
  }
}

export default FlightService
