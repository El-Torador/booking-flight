import { AirportDTO } from './Airport'
import { FlightDTO } from './Flight'
import { Passenger } from './Passenger'

// import type { DateTime } from 'luxon'
export interface BookingDTO<T extends string | AirportDTO> {
  id: string
  flight?: FlightDTO<T>
  flight_id: string
  date_departiture: number
  quantity: number
  discount?: number
  discount_cond?: number
  currency_rate: number
  currency: string
  cost_per_more_luggages?: number
  luggages: number
  passengers?: Passenger[]
  // created_at: DateTime
}
