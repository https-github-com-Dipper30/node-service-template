import { MiddleWare } from '@/types'
import { NextFunction, Request, Response } from 'express'

export default class BaseController {
  defaultPager = { page: 1, size: 20 }

  constructor() {
    //
  }

  call(fn: MiddleWare) {
    return (req: Request, res: Response, next: NextFunction) => {
      return Promise.resolve(fn.call(this, req, res, next)).catch(next)
    }
  }
}
