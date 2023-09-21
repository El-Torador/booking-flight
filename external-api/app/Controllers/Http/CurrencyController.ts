// import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { inject } from '@adonisjs/fold'
import CurrencyService from 'App/Services/CurrencyService'

@inject()
export default class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  public index() {
    return this.currencyService.getCurrencies()
  }
}
