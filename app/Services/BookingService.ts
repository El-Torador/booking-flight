import { BookingDTO } from 'App/DTO/Booking'
import BookingEntity from 'App/Entities/Booking'

class BookingService {
  public async postBooking(booking: Omit<BookingDTO, 'id'>): Promise<BookingDTO> {
    return BookingEntity.store(booking)
  }
  public async getBooking(): Promise<BookingDTO[]> {
    return BookingEntity.get()
  }
}

export default BookingService
