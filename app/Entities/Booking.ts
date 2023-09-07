import { cuid } from '@ioc:Adonis/Core/Helpers'
import { BookingDTO } from './../DTO/Booking'

class BookingEntity {
  private static bookings: BookingDTO[] = []

  public static store(book: Omit<BookingDTO, 'id'>): Promise<BookingDTO> {
    return new Promise((resolve, _) => {
      const newBooking = {
        id: cuid(),
        ...book,
      } as BookingDTO

      this.bookings.push(newBooking)
      resolve(newBooking)
    })
  }

  public static get(): Promise<BookingDTO[]> {
    return new Promise((resolve, _) => {
      resolve(this.bookings)
    })
  }
}

export default BookingEntity
