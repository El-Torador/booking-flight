import Env from '@ioc:Adonis/Core/Env'
import { inject } from '@adonisjs/fold'
import { FlightDTO } from 'App/DTO/Flight'
import FlightEntity from 'App/Entities/Flight'
import AirportService from './AirportService'
import { AirportDTO } from 'App/DTO/Airport'

@inject()
class FlightService {
  private cost_per_more_luggages: number = Env.get('COST_PER_MORE_LUGGAGES')

  constructor(private airportService: AirportService) {}

  public async getFlights(page: number = 0, limit: number = 0): Promise<FlightDTO<AirportDTO>[]> {
    const flights = await FlightEntity.getAll(page, limit)
    const airports = await this.airportService.getAll()
    //TODO: GET FLIGHTS FROM OTHERS AIRLINES

    return flights.map((flight) => ({
      ...flight,
      airport_departiture: airports.find((a) => a.id === flight.airport_departiture)!,
      airport_destination: airports.find((a) => a.id === flight.airport_destination)!,
    }))
  }

  public async getFlight(id: string): Promise<FlightDTO<AirportDTO> | null> {
    const flight = await FlightEntity.getOne(id)
    if (!flight) return null

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
