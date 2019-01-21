const env = require('sugar-env')
import IMongoParams from './data/interfaces/IMongoParams'

export interface IAppConfig {
  database: {
    mongodb: IMongoParams
  }
}

export const config: IAppConfig = {
  database: {
    mongodb: {
      dbName: env.get('DATABASE_MONGODB_DBNAME'),
      uri: env.get('DATABASE_MONGODB_URI'),
      options: {}
    }
  }
}
