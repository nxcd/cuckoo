const rescue = require('express-rescue')
const { HttpError } = require('@expresso/expresso')
import { SchedulingService } from '../../../services/SchedulingService'
import { Request, Response, NextFunction, RequestHandler } from 'express'
import { SchedulingNotFoundError } from '../../../domain/schedule/errors/SchedulingNotFoundError'

export function factory (service: SchedulingService): RequestHandler[] {
  return [
    rescue(async (req: Request, res: Response) => {
      const scheduling = await service.find(req.params.scheduling)

      res.status(200)
        .json({ ...scheduling.state, response: scheduling.response })
    }),
    (err: Error, _req: Request, _res: Response, next: NextFunction) => {
      if (err instanceof SchedulingNotFoundError) {
        return next(new HttpError.NotFound({ message: err.message }))
      }

      next(err)
    }
  ]
}
