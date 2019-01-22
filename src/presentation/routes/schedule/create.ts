import moment from 'moment'
const rescue = require('express-rescue')
const { validate } = require('@expresso/expresso')
import { SchedulingService } from '../../../services/SchedulingService'
import { Request, Response, RequestHandler } from 'express'

interface IAuthenticatedRequest extends Request {
  onBehalfOf: string
}

export function factory (service: SchedulingService): RequestHandler[] {
  return [
    validate({
      definitions: {
        scheduling: {
          type: 'object',
          properties: {
            timestamp: {
              type: 'string',
              format: 'date-time'
            },
            method: {
              type: 'string',
              enum: ['put', 'post', 'patch', 'delete']
            },
            url: {
              type: 'string',
              format: 'uri'
            },
            payload: {
              type: 'object'
            },
            params: {
              type: 'object'
            },
            headers: {
              type: 'object'
            }
          },
          required: ['timestamp', 'method', 'url']
        },
        copyFromId: {
          type: 'object',
          properties: {
            originId: {
              type: 'string'
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['originId']
        }
      },
      anyOf: [
        { $ref: '#/definitions/scheduling' },
        { $ref: '#/definitions/copyFromId' }
      ]
    }),
    rescue(async (req: IAuthenticatedRequest, res: Response) => {
      const { timestamp, method, url, payload = null, params = null, headers = null } = req.body
      const user = req.onBehalfOf
      const app = req.headers['x-app-id'] as string

      const actualTimestamp = moment(timestamp).toDate()

      const scheduling = req.body.originId
        ? await service.createFrom(req.body.originId, actualTimestamp, user, app)
        : await service.create({ timestamp: actualTimestamp, method, url, payload, params, headers }, user, app)

      res.status(201)
        .json(scheduling.state)
    })
  ]
}
