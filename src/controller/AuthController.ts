import { AuthService, TokenService } from '@/service'
import { TokenDecode } from '@/types'
import { isError } from '@/utils'
import { Request, Response } from 'express'
import BaseController from './BaseController'

const defaultPager = { page: 1, size: 20 }

class Auth extends BaseController {

  constructor () {
    super()
  }

  async login (req: any, res: any) {
    const { username, password } = req.body
    const user = await AuthService.loginAccount({ username, password })

    const token = await TokenService.generateToken({ id: user.id, rid: user.role.id, auth: user.auth })

    res.json({
      code: 200,
      msg: 'signed in',
      data: {
        user,
        token,
      },
    })
  }

  async autoLogin (req: Request, res: Response) {
    const { token } = req.body
    const result: TokenDecode = await TokenService.verifyToken(token)

    const user = await AuthService.getUserById(result.uid)
    const auth = user.auth.map((a: any) => a.id)
    const newToken = await TokenService.generateToken({ id: user.id, rid: user.rid, auth })
    res.json({
      code: 200,
      msg: 'ok',
      data: {
        user: { ...user, auth },
        token: newToken,
      },
    })
  }

  async isUsernameAvailable (req: Request, res: Response) {
    const { username } = req.query
    const available = await AuthService.isUsernameExisting(username as string)

    res.json({
      code: 200,
      msg: 'ok',
      data: !available,
    })
  }

  async getUserById (req: Request, res: Response) {
    const user = await AuthService.getUserById(Number(req.query.id))

    res.json({
      code: 200,
      msg: 'ok',
      data: user,
    })
  }

  async getUsers (req: Request, res: Response) {
    const query: any = req.query
    const data: {
        id?: number,
        username?: string,
        rid?: number,
        page: number,
        size: number
      } = { ...defaultPager }
    if (query.id) data.id = Number(query.id)
    if (query.username) data.username = query.username
    if (query.rid) data.rid = Number(query.rid)
    if (query.page) data.page = Number(query.page)
    if (query.size) data.size = Number(query.size)

    const users = await AuthService.getUsers(data)

    res.json({
      code: 200,
      msg: 'ok',
      data: users,
    })
  }

  /**
   * 由超级管理员创建管理员账号
   * @param req
   * @param res
   * @param next
   */
  async createAccount (req: Request, res: Response) {
    const { username, password, rid, tokenUserId: cid } = req.body
    const uid = await AuthService.createAccount({ username, password, rid, cid })

    res.json({
      code: 201,
      msg: 'account created',
      data: {
        uid,
      },
    })
  }

  async updateUserAuth (req: Request, res: Response) {
    const updated = await AuthService.updateUserAuth(req.body)

    res.json({
      code: 201,
      msg: 'user auth updated',
      data: updated,
    })
  }

  /**
   * 修改用户自己信息
   */
  async updateUserInfo (req: Request, res: Response) {
    const updated = await AuthService.updateUserInfo(req.body)

    const token = await TokenService.generateToken({ id: updated.id, rid: updated.role.id, auth: updated.auth })

    res.json({
      code: 201,
      msg: 'user info updated',
      data: {
        user: updated,
        token,
      },
    })
  }

  async createAuthority (req: Request, res: Response) {
    const { id, name, description } = req.body
    const auth = await AuthService.createAuthority({ id, name, description })

    res.json({
      code: 201,
      msg: 'auth created',
      data: {
        auth,
      },
    })
  }

  async getAuthorities (req: Request, res: Response) {
    const auth = await AuthService.getAuthorities(req.query)
    if (isError(auth)) throw auth

    res.json({
      code: 200,
      msg: 'ok',
      data: {
        auth,
      },
    })
  }

  async updateAuthority (req: Request, res: Response) {
    const auth = await AuthService.updateAuthority(req.body)

    res.json({
      code: 201,
      msg: 'auth updated',
      data: {
        auth,
      },
    })
  }

  async createRole (req: Request, res: Response) {
    const role = await AuthService.createRole(req.body)
    if (isError(role)) throw role

    res.json({
      code: 200,
      msg: 'role created',
      data: {
        role,
      },
    })
  }

  async getRoles (req: Request, res: Response) {
    const roles = await AuthService.getRoles(req.query)
    if (isError(roles)) throw roles

    res.json({
      code: 200,
      msg: 'ok',
      data: {
        roles,
      },
    })

  }

  async getAdminRoles (req: Request, res: Response) {

    const roles = await AuthService.getAdminRoles()
    if (isError(roles)) throw roles

    res.json({
      code: 200,
      msg: 'ok',
      data: {
        roles,
      },
    })
  }

  async updateRole (req: Request, res: Response) {
    const role = await AuthService.updateRole(req.body)
    if (isError(role)) throw role

    res.json({
      code: 201,
      msg: 'role updated',
      data: {
        role,
      },
    })
  }
}

export default new Auth()