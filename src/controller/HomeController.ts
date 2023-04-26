import { HomeService } from '@/service'
import { NextFunction, Request, Response } from 'express'
import BaseController from './BaseController'

class Home extends BaseController {

  constructor () {
    super()
  }

  async getCurrentActiveUsers (req: Request, res: Response, next: NextFunction) {
    try {
      const users = await HomeService.getCurrentActiveUsers()
      res.json({
        code: 200,
        msg: 'ok',
        data: {
          total: users.length,
          users: users,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async getDailyActiveUsers (req: Request, res: Response, next: NextFunction) {
    try {
      const dau = await HomeService.getDailyActiveUsers()
      res.json({
        code: 200,
        msg: 'ok',
        data: {
          dau,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async getMonthlyActiveUsers (req: Request, res: Response, next: NextFunction) {
    try {
      const mau = await HomeService.getMonthlyActiveUsers()
      res.json({
        code: 200,
        msg: 'ok',
        data: {
          mau,
        },
      })
    } catch (error) {
      next(error)
    }
  }

}

export default new Home()