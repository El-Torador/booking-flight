import { Airline } from "App/DTO/Airline";
import { AirportDTO } from "App/DTO/Airport";
import { BookingDTO } from "App/DTO/Booking";

export interface QueueInterface {
  id: BookingDTO<string | AirportDTO>['id']
  airline: Airline['code']
}