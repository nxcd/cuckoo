import { Event } from '@nxcd/paradox'
import { Scheduling } from '../Scheduling'

interface ITimeoutSetParams {
  timeoutId: number
}

export class TimeoutWasSetEvent extends Event<ITimeoutSetParams> {
  static readonly eventName: string = 'timeout-was-set'

  constructor (data: ITimeoutSetParams) {
    super(TimeoutWasSetEvent.eventName, data)
  }

  static commit (state: Scheduling, event: TimeoutWasSetEvent) {
    state.timeoutId = event.data.timeoutId
    return state
  }
}
