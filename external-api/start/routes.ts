/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Application from '@ioc:Adonis/Core/Application'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'
import Route from '@ioc:Adonis/Core/Route'
import swagger from 'Config/swagger'
import AutoSwagger from 'adonis-autoswagger'

Route.get('/', async () => {
  return {
    title: `WELCOME TO ${Application.appName.toUpperCase()}`,
    version: `${Application.version?.toString()}`,
    made_by: 'K\u2074 AIRLINE COMPANY.',
    technology: `AdonisJS ${Application.adonisVersion?.toString()}`,
    environment: `${Application.nodeEnvironment}`,
    ready: Application.isReady,
    healthy: (await HealthCheck.getReport()).healthy,
    docs: '/docs',
    repo: 'https://github.com/El-Torador/booking-flight/tree/main/external-api',
    licence: 'OPEN-SOURCE',
  }
})

Route.get('/healtCheck', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

// returns swagger in YAML
Route.get('/swagger', async () => {
  return AutoSwagger.docs(Route.toJSON(), {
    ...swagger,
    snakeCase: false,
  })
})

// Renders Swagger-UI and passes YAML-output of /swagger
Route.get('/docs', async () => {
  return AutoSwagger.ui('/swagger')
})

Route.group(() => {
  Route.group(() => {
    Route.get('/', 'FlightController.index')
    Route.get('/costLuggage', 'FlightController.getCostPerLuggages')
    Route.get('/external', 'FlightController.getExternalFlight')
    Route.get('/:id/getRestPlace', 'FlightController.getCurrentSeatsFlight')
    Route.get('/:id', 'FlightController.show')
    Route.group(() => {
      Route.get('/all', 'FlightController.getExternalFlights')
      Route.get('/:id', 'FlightController.getExternalFlight')
    }).prefix('external')
  }).prefix('flights')

  Route.group(() => {
    Route.get('/', 'BookingController.index')
    Route.post('/', 'BookingController.create')
    Route.get('/:id', 'BookingController.show')
    Route.get('/:id/confirm', 'BookingController.store')
    Route.delete('/:id/cancel', 'BookingController.undo')
  }).prefix('bookings')

  Route.group(() => {
    Route.get('/', 'CurrencyController.index')
  }).prefix('currencies')
})
  .prefix('v1')
  .prefix('api')
  .middleware('authorized')
  .middleware('logrequest')
