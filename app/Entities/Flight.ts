import { FlightDTO } from 'App/DTO/Flight'
import { COST_PER_LUGGAGES, FlightData } from 'App/data'

class FlightEntity {
  private static flights: FlightDTO[] = [...FlightData]

  public static getAll(): FlightDTO[] {
    return this.flights
  }

  public static getOne(id: string): FlightDTO | undefined {
    return this.flights.find((f) => f.id === id)
  }

  public static getCoast(): number {
    return COST_PER_LUGGAGES
  }
}

export default FlightEntity
