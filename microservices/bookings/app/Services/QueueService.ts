import { inject } from "@adonisjs/fold"
import Logger from "@ioc:Adonis/Core/Logger"
import BookingService from "App/Services/BookingService"
import { QueueInterface } from "Contracts/QueueInterface"

@inject()
class QueueService {
  private queue: QueueInterface[] = []

  constructor(private bookingService: BookingService) {}

  addToQueue(items: QueueInterface[]) {
    Logger.info(`NEW items added in queue: ${JSON.stringify(items)}`)
    this.queue.push(...items)
    this.processQueue()
  }

  private async processQueue() {
    while (this.queue.length > 0) {
      const item = this.queue[0]
      Logger.info(`Cancelling booking ${item.id} from ${item.airline} AIRLINE...`)
      let retryCount = 5

      while (retryCount > 0) {
        try {
          await this.executeAction(item)
          this.queue.shift()
          Logger.info(`Cancel succesfully booking ${item.id} from ${item.airline} AIRLINE.`)
          break
        } catch (error) {
          Logger.error(`Action failed for booking ${item.id} from ${item.airline} AIRLINE.`)
          retryCount--
          if (retryCount === 0) {
            Logger.error(`All attempts failed when cancelling the booking ${item.id} from ${item.airline}.`)
            this.queue.push(this.queue.shift()!)
          }
        }
      }
    }
  }

  private async executeAction(item: QueueInterface) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(async () => {
        let result: boolean

        try {
          if (item.airline === 'K⁴' || item.airline.toUpperCase() === 'CAJE')
          result = await this.bookingService.removeBooking(item.id)
        else {
          result = await this.bookingService.removeExternalBooking(item.id)
        }
        if (result) {
          Logger.info(`Action performed for the booking : ${item.id} from ${item.airline} AIRLINE.`)
          resolve()
        } else {
          reject()
        }
        } catch (error) {
          Logger.error(error)
          reject(new Error("Action failed."))
        }
      }, 1000)
    })
  }
}

export default QueueService
