import { Event } from '@nxcd/paradox'
import { Scheduling } from '../Scheduling'

export interface IResponseInfo {
  data: any
  headers: any
  status: number
}

export class ResponseWasSetEvent extends Event<IResponseInfo | string> {
  static readonly eventName: string = 'response-was-set'

  constructor (data: IResponseInfo | string) {
    const actualData = typeof data !== 'string'
      ? { data: data.data, headers: data.headers, status: data.status }
      : data

    super(ResponseWasSetEvent.eventName, actualData)
  }

  static commit (state: Scheduling, event: ResponseWasSetEvent) {
    state.response = event.data
    return state
  }
}
