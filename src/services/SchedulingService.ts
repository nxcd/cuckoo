import { ObjectId } from 'mongodb'
import axios, { AxiosResponse, AxiosError } from 'axios'
import { Method } from '../domain/schedule/enums/Method'
import { Scheduling } from '../domain/schedule/Scheduling'
import { SchedulingStatus } from '../domain/schedule/enums/SchedulingStatus'
import { SchedulingRepository } from '../data/repositories/SchedulingRepository'
import { SchedulingNotFoundError } from '../domain/schedule/errors/SchedulingNotFoundError'

export interface ISchedulingParams {
  timestamp: Date
  method: Method
  url: string
  payload: { [ key: string ]: any }
  params: { [ key: string ]: any }
  headers: { [ key: string ]: string }
}

async function executeScheduling (schedulingId: ObjectId, repository: SchedulingRepository) {
  const scheduling = await repository.findById(schedulingId)

  if (!scheduling) return

  if ([ SchedulingStatus.CANCELED, SchedulingStatus.EXECUTED ].includes(scheduling.status)) return

  const response = await axios(scheduling.getRequestConfig()).catch((err: AxiosError): AxiosResponse<any> | string => err.response || err.message)

  scheduling
    .setStatus(SchedulingStatus.EXECUTED)
    .setResponse(response)

  await repository.save(scheduling)
}

export class SchedulingService {
  private readonly repository: SchedulingRepository

  constructor (repository: SchedulingRepository) {
    this.repository = repository
  }

  async setup () {
    const schedulings = await this.repository.getAllScheduled()

    for (const scheduling of schedulings) {
      setTimeout(() => executeScheduling(scheduling.id as ObjectId, this.repository), scheduling.getDifference())
      console.log(`Created timeout for ${(scheduling.id as ObjectId).toHexString()}`)
    }
  }

  async create (params: ISchedulingParams, user: string, app: string) {
    const scheduling = Scheduling.create({ id: new ObjectId(), ...params }, user, app)

    await this.repository.save(scheduling)

    setTimeout(async (schedulingId: ObjectId) => {
      executeScheduling(schedulingId, this.repository)
    }, scheduling.getDifference(), scheduling.id)

    return scheduling
  }

  async cancel (schedulingId: string) {
    const scheduling = await this.repository.findById(schedulingId)

    if (!scheduling || [ SchedulingStatus.CANCELED, SchedulingStatus.EXECUTED ].includes(scheduling.status)) return

    scheduling.setStatus(SchedulingStatus.CANCELED)

    await this.repository.save(scheduling)
  }

  async find (id: string) {
    const scheduling = await this.repository.findById(id)

    if (!scheduling) throw new SchedulingNotFoundError(id)

    return scheduling
  }
}
