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
    title: `WELCOME TO ${Application.appName.toUpperCase()} API`,
    version: `${Application.version?.toString()}`,
    made_by: 'K\u2074 AIRLINE COMPANY.',
    technology: `AdonisJS ${Application.adonisVersion?.toString()}`,
    environment: `${Application.nodeEnvironment}`,
    ready: Application.isReady,
    docs: '/docs',
    repo: 'https://github.com/El-Torador/booking-flight',
    licence: 'OPEN-SOURCE',
  }
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

Route.get('/health', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  Route.get('/flights', 'FlightController.index')
  Route.get('/flights/costLuggage', 'FlightController.getCostPerLuggages')
  Route.get('/flights/:id/getRestPlace', 'FlightController.getCurrentSeatsFlight')
  Route.get('/flights/:id', 'FlightController.show')
  Route.get('/bookings', 'BookingController.index')
  Route.post('/bookings', 'BookingController.create')
  Route.get('/bookings/:id', 'BookingController.show')
  Route.get('/bookings/:id/confirm', 'BookingController.store')
  Route.delete('/bookings/:id/cancel', 'BookingController.undo')
  Route.get('/currencies', 'CurrencyController.index')
})
  .prefix('v1')
  .prefix('api')
