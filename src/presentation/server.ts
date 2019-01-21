import { app } from './app'
import { config } from '../app-config'
const { server } = require('@expresso/expresso')

export function start () {
  server.start(app, config)
}

export default { start }
