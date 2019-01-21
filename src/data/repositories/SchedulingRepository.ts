import { Db } from 'mongodb'
import { MongodbEventRepository } from '@nxcd/paradox'
import { Scheduling } from '../../domain/schedule/Scheduling'
import { SchedulingStatus } from '../../domain/schedule/enums/SchedulingStatus';

export class SchedulingRepository extends MongodbEventRepository<Scheduling> {
  constructor (connection: Db) {
    super(connection.collection(Scheduling.collection), Scheduling)
  }

  async getAllScheduled (): Promise<Scheduling[]> {
    return this._collection.find({ 'state.status': SchedulingStatus.SCHEDULED })
      .project({ events: 1 })
      .toArray()
      .then(documents => documents.map(document => {
        return new Scheduling().setPersistedEvents(document.events)
      }))
  }
}
