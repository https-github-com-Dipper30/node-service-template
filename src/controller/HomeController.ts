import { HomeService } from '@/service'
import { Request, Response } from 'express'
import BaseController from './BaseController'

class Home extends BaseController {

  constructor () {
    super()
  }

  async getCurrentActiveUsers (req: Request, res: Response) {
    const users = await HomeService.getCurrentActiveUsers()
    res.json({
      code: 200,
      msg: 'ok',
      data: {
        total: users.length,
        users: users,
      },
    })
  }

  async getDailyActiveUsers (req: Request, res: Response) {

    const dau = await HomeService.getDailyActiveUsers()
    res.json({
      code: 200,
      msg: 'ok',
      data: {
        dau,
      },
    })
  }

  async getMonthlyActiveUsers (req: Request, res: Response) {
    const mau = await HomeService.getMonthlyActiveUsers()
    res.json({
      code: 200,
      msg: 'ok',
      data: {
        mau,
      },
    })
  }

}

export default new Home()