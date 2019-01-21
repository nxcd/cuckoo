import { Event } from '@nxcd/paradox'
import { SchedulingStatus } from '../enums/SchedulingStatus'
import { Scheduling } from '../Scheduling';

interface IStatusChangeParams {
  newStatus: SchedulingStatus
}

export class SchedulingStatusChangedEvent extends Event<IStatusChangeParams> {
  static readonly eventName: string = 'scheduling-status-changed'

  constructor (data: IStatusChangeParams) {
    super(SchedulingStatusChangedEvent.eventName, data)
  }

  static commit (state: Scheduling, event: SchedulingStatusChangedEvent) {
    state.status = event.data.newStatus
    return state
  }
}
