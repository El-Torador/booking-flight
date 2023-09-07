import { FlightDTO } from 'App/DTO/Flight'
import FlightEntity from 'App/Entities/Flight'

class FlightService {
  public getFlights(): FlightDTO[] {
    return FlightEntity.getAll()
  }

  public getFlight(id: string): FlightDTO | undefined {
    return FlightEntity.getOne(id)
  }
}

export default FlightService
