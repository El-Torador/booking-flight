import { AirportDTO } from './Airport'
import { FlightDTO } from './Flight'
import { Passenger } from './Passenger'

export interface BookingDTO<T extends string | AirportDTO> {
  id: string
  flight?: FlightDTO<T>
  flight_id: string
  date_departiture: number
  quantity: number
  discount?: number
  discount_cond?: number
  currency_rate?: number
  email_guest: string
  currency: string
  cost_per_more_luggages?: number
  luggages: number
  passengers?: Passenger[]
}
