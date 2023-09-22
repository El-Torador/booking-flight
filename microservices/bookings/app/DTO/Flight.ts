import { Airline } from './Airline'
import { AirportDTO } from './Airport'

export interface FlightDTO<T extends string | AirportDTO> {
  id: string
  airport_departiture: T
  airport_destination: T
  price: number
  seats: number
  luggages_limit: number
  stopover: string[]
  airline: string | Airline
}
