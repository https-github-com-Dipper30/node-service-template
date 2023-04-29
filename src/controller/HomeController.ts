import { HomeService } from '@/service'
import { Request, Response } from 'express'
import BaseController from './BaseController'
import { returnJSON } from '@/utils'

class Home extends BaseController {
  constructor() {
    super()
  }

  async getCurrentActiveUsers(req: Request, res: Response) {
    const users = await HomeService.getCurrentActiveUsers()
    returnJSON(200, 'ok', {
      total: users.length,
      users: users,
    })
  }

  async getDailyActiveUsers(req: Request, res: Response) {
    const dau = await HomeService.getDailyActiveUsers()
    returnJSON(200, 'ok', {
      dau,
    })
  }

  async getMonthlyActiveUsers(req: Request, res: Response) {
    const mau = await HomeService.getMonthlyActiveUsers()
    returnJSON(200, 'ok', {
      mau,
    })
  }
}

export default new Home()
