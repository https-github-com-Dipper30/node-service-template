import { HomeService } from '@/service'
import { Request, Response } from 'express'
import BaseController from './BaseController'
import { wrapJSON } from '@/utils'

class Home extends BaseController {
  constructor() {
    super()
  }

  async getCurrentActiveUsers(req: Request, res: Response) {
    const users = await HomeService.getCurrentActiveUsers()
    res.json(
      wrapJSON(200, 'ok', {
        total: users.length,
        users: users,
      }),
    )
  }

  async getDailyActiveUsers(req: Request, res: Response) {
    const dau = await HomeService.getDailyActiveUsers()
    res.json(
      wrapJSON(200, 'ok', {
        dau,
      }),
    )
  }

  async getMonthlyActiveUsers(req: Request, res: Response) {
    const mau = await HomeService.getMonthlyActiveUsers()
    res.json(
      wrapJSON(200, 'ok', {
        mau,
      }),
    )
  }
}

export default new Home()
