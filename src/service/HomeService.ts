import { TUserSimpleProfile } from '@/types'
import BaseService from './BaseService'

const models = require('@/db/models')
const {
  User: UserModel,
  CurrentActiveUser: CurrentActiveUserModel,
} = models
class Home extends BaseService {

  transporter: any

  constructor () {
    super()
  }

  async loginUser (user: TUserSimpleProfile): Promise<boolean> {
    const loggedIn = await CurrentActiveUserModel.findOne({
      where: {
        uid: user.id,
      },
    })
    if (loggedIn) return true
    return await CurrentActiveUserModel.create({
      uid: user.id,
      username: user.username,
      avatar: user.avatar || '',
    })
  }

  async logoutUser (uid: number) {
    return await CurrentActiveUserModel.destroy({
      where: {
        uid,
      },
    })
  }

  async clearCurrentActiveUsers () {
    await CurrentActiveUserModel.destroy({
      where: {},
      truncate: true,
    })
  }

  async getDailyActiveUsers (): Promise<number[][]> {
    return [
      [1682524800, 10],
      [1682438400, 20],
      [1682352000, 30],
      [1682265600, 2],
      [1682179200, 1],
      [1682092800, 12],
      [1682006400, 30],
    ]
  }

  async getMonthlyActiveUsers (): Promise<number[][]> {
    return [
      [1680278400, 180],
      [1677600000, 250],
      [1675180800, 520],
      [1672502400, 330],
      [1669824000, 400],
      [1667232000, 220],
    ]

  }

  async getCurrentActiveUsers (): Promise<TUserSimpleProfile[]> {
    const users = await UserModel.findAll({
      attributes: ['id', 'username'],
    })
    return users
  }
}

export default new Home()