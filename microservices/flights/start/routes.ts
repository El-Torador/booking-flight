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

Route.get('/', async () => {
  return {
    title: `WELCOME TO ${Application.appName.toUpperCase()} ENGINE`,
    version: `${Application.version?.toString()}`,
    made_by: 'K\u2074 AIRLINE COMPANY.',
    technology: `AdonisJS ${Application.adonisVersion?.toString()}`,
    environment: `${Application.nodeEnvironment}`,
    ready: Application.isReady,
    healthy: (await HealthCheck.getReport()).healthy,
    repo: 'https://github.com/El-Torador/booking-flight/tree/main/microservices/flights',
    licence: 'OPEN-SOURCE',
  }
})

Route.get('/healtCheck', async ({ response }) => {
  const report = await HealthCheck.getReport()

  return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  Route.get('/', 'FlightsController.index')
  Route.get('/costLuggage', 'FlightsController.getCostPerLuggages')
  Route.get('/:id/getRestPlace', 'FlightsController.getCurrentSeatsFlight')
  Route.get('/:id', 'FlightsController.show')
})
  .prefix('flights')
  .prefix('v1')
  .prefix('api')
  .middleware('authorized')
  .middleware('logrequest')
