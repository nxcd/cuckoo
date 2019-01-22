import { Express } from 'express'
import { routes } from './routes'
import { IAppConfig } from '../app-config'
const expresso = require('@expresso/expresso')
import mongodb from '../data/connections/mongodb'
import { SchedulingService } from '../services/SchedulingService'
import { SchedulingRepository } from '../data/repositories/SchedulingRepository'

export const app = expresso(async (app: Express, config: IAppConfig) => {
  const mongodbConnection = await mongodb.createConnection(config.database.mongodb)

  const schedulingRepository = new SchedulingRepository(mongodbConnection)
  const schedulingService = new SchedulingService(schedulingRepository)

  await schedulingService.setup()

  app.post('/schedulings', routes.schedule.create.factory(schedulingService))
  app.delete('/schedulings/:scheduling', routes.schedule.delete.factory(schedulingService))
})
