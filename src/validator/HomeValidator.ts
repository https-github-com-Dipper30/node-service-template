import { Request, Response, NextFunction } from 'express'
import BaseValidator from './BaseValidator'

class HomeValidator extends BaseValidator {

  constructor () {
    super()
  }

  getCurrentActiveUsers (req: Request, res: Response, next: NextFunction) {
    try {
      next()
    } catch (error) {
      next(error)
    }
  }

  getDailyActiveUsers (req: Request, res: Response, next: NextFunction) {
    try {
      next()
    } catch (error) {
      next(error)
    }
  }

  getMonthlyActiveUsers (req: Request, res: Response, next: NextFunction) {
    try {
      next()
    } catch (error) {
      next(error)
    }
  }
}

export default new HomeValidator()