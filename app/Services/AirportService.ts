import { AirportDTO } from 'App/DTO/Airport'
import AirportEntity from 'App/Entities/Airport'

class AirportService {
  public getAirport(id: string): Promise<AirportDTO | null> {
    return AirportEntity.getOne(id)
  }

  public getAll(page: number = 0, limit: number = 0): Promise<AirportDTO[]> {
    return AirportEntity.getAll(page, limit)
  }
}

export default AirportService
