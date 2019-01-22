const rescue = require('express-rescue')
import { SchedulingService } from '../../../services/SchedulingService'
import { Request, Response, RequestHandler } from 'express'

export function factory (service: SchedulingService): RequestHandler[] {
  return [
    rescue(async (req: Request, res: Response) => {
      const id = req.params.scheduling

      await service.cancel(id)

      res.status(204)
        .end()
    })
  ]
}
