import { ObjectId } from 'mongodb'
import { Event } from '@nxcd/paradox'
import { Method } from '../enums/Method'
import { Scheduling } from '../Scheduling';

export interface ISchedulingCreationParams {
  id: ObjectId
  timestamp: Date
  method: Method
  url: string
  payload: { [ key: string ]: any }
  params: { [ key: string ]: any }
  headers: { [ key: string ]: string }
}

export class SchedulingWasCreatedEvent extends Event<ISchedulingCreationParams> {
  static readonly eventName: string = 'scheduling-was-created'
  private readonly user: string
  private readonly app: string

  constructor (data: ISchedulingCreationParams, user: string, app: string) {
    super(SchedulingWasCreatedEvent.eventName, data)
    this.user = user
    this.app = app
  }

  static commit (state: Scheduling, event: SchedulingWasCreatedEvent): Scheduling {
    state.id = event.data.id
    state.url = event.data.url
    state.createdBy = event.user
    state.createdThrough = event.app
    state.method = event.data.method
    state.params = event.data.params
    state.createdAt = event.timestamp
    state.headers = event.data.headers
    state.payload = event.data.payload
    state.timestamp = event.data.timestamp

    return state
  }
}
