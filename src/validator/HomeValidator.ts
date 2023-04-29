import { Request, Response, NextFunction } from 'express'
import BaseValidator from './BaseValidator'

class HomeValidator extends BaseValidator {
  constructor() {
    super()
  }

  getCurrentActiveUsers(req: Request, res: Response, next: NextFunction) {
    next()
  }

  getDailyActiveUsers(req: Request, res: Response, next: NextFunction) {
    next()
  }

  getMonthlyActiveUsers(req: Request, res: Response, next: NextFunction) {
    next()
  }
}

export default new HomeValidator()
