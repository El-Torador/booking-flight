import { Ioc } from '@adonisjs/fold'
import type { EventsList } from '@ioc:Adonis/Core/Event'
import QueueService from 'App/Services/QueueService'

class QueueListener {
  private queueService: QueueService;
  constructor(){
    const ioc = new Ioc()
    this.queueService = ioc.make(QueueService)
  }

  public async onNewItems(items: EventsList['new:items']) {
    this.queueService.addToQueue(items)
  }
}

export default QueueListener

