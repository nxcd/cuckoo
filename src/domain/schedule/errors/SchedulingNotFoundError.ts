import { SchedulingError } from './SchedulingError'

export class SchedulingNotFoundError extends SchedulingError {
  constructor (id: string) {
    super(`Scheduling "${id}" could not be found`)
  }
}
