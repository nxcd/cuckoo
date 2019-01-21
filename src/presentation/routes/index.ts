import { IRouteMap } from '../structures/interfaces/IRouteMap'
import { SchedulingService } from '../../services/SchedulingService'

export interface IAppRoutes {
  schedule: IRouteMap<SchedulingService>
}

export const routes: IAppRoutes = {
  schedule: {
    create: require('./schedule/create')
  }
}
