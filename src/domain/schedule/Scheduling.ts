import moment from 'moment'
import { ObjectId } from 'mongodb'
import { Method } from './enums/Method'
import { EventEntity } from '@nxcd/paradox'
import { IResponseInfo } from './events/response-was-set'
import { SchedulingStatus } from './enums/SchedulingStatus'

/**
 * Events
 * =======
 */
import { TimeoutWasSetEvent } from './events/timeout-was-set'
import { ResponseWasSetEvent } from './events/response-was-set'
import { SchedulingStatusChangedEvent } from './events/scheduling-status-changed'
import { ISchedulingCreationParams, SchedulingWasCreatedEvent } from './events/scheduling-was-created'

export class Scheduling extends EventEntity<Scheduling> {
  static readonly collection: string = 'schedulings'

  /** Data */
  public id: ObjectId | null = null
  public timestamp: Date | null = null
  public method: Method | null = null
  public url: string | null = null
  public params: { [ key: string ]: any } | null = null
  public payload: { [ key: string ]: any } | null = null
  public headers: { [ key: string ]: string } | null = null

  /** Metadata */
  public createdAt: Date | null = null
  public createdBy: string | null = null
  public createdThrough: string | null = null
  public status: SchedulingStatus = SchedulingStatus.SCHEDULED
  public response: IResponseInfo | string | null = null

  constructor () {
    super({
      [TimeoutWasSetEvent.eventName]: TimeoutWasSetEvent.commit,
      [ResponseWasSetEvent.eventName]: ResponseWasSetEvent.commit,
      [SchedulingWasCreatedEvent.eventName]: SchedulingWasCreatedEvent.commit,
      [SchedulingStatusChangedEvent.eventName]: SchedulingStatusChangedEvent.commit
    })
  }

  static create (params: ISchedulingCreationParams, user: string, app: string) {
    const scheduling = new Scheduling()

    scheduling.pushNewEvents([
      new SchedulingWasCreatedEvent(params, user, app)
    ])

    return scheduling
  }

  setStatus (newStatus: SchedulingStatus) {
    this.pushNewEvents([
      new SchedulingStatusChangedEvent({ newStatus })
    ])

    return this
  }

  setTimeoutId (timeoutId: number) {
    this.pushNewEvents([
      new TimeoutWasSetEvent({ timeoutId })
    ])

    return this
  }

  getDifference (baseDate?: Date): number {
    return moment(this.timestamp as Date).diff(moment(baseDate))
  }

  setResponse (response: IResponseInfo | string) {
    this.pushNewEvents([
      new ResponseWasSetEvent(response)
    ])

    return this
  }

  get state () {
    const currentState = this.reducer.reduce(new Scheduling(), [
      ...this.persistedEvents,
      ...this.pendingEvents
    ])

    return {
      id: currentState.id,
      timestamp: currentState.timestamp,
      method: currentState.method,
      url: currentState.url,
      payload: currentState.payload,
      params: currentState.params,
      headers: currentState.headers
    }
  }

  getRequestConfig () {
    return {
      url: this.url as string,
      data: this.payload as { [ key: string ]: string },
      params: this.params as { [ ket: string ]: any },
      method: this.method as Method,
      headers: this.headers as { [ key: string ]: string }
    }
  }
}
