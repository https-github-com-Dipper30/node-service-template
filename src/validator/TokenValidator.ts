import BaseValidator from './BaseValidator'
import jwt from 'jsonwebtoken'
import { AuthException, TokenException } from '@/exception'
import { APP_CONFIG } from '@/config'
import { getUnixTS, isError } from '@/utils'
import { ERROR_CODE } from '@/constants'
import { Request, Response, NextFunction } from 'express'
const models = require('@/db/models')
const {
  UserAuthority: UserAuthModel,
} = models

class TokenValidator extends BaseValidator {

  constructor () {
    super()
  }

  async verifyToken (req: any, res: any, next: any) {
    try {
      const { token } = req.headers
      if (!token) throw new TokenException(ERROR_CODE.TOKEN_ERROR, 'Missing Token')

      const decode: any = jwt.verify(token, APP_CONFIG.KEYS.TOKEN_PRIVATE_KEY) || {}
      const { uid, rid, auth, exp } = decode
      const current = getUnixTS()
      if (current > exp) throw new TokenException(ERROR_CODE.TOKEN_EXPIRED)

      // append token info to request body
      req.body.tokenUserId = uid
      req.body.tokenUserRoleId = rid
      req.body.tokenUserAuth = auth

      next()
    } catch (error) {
      if (error instanceof TokenException) next(error)
      else next(new TokenException(ERROR_CODE.TOKEN_PARSE_ERROR))
    }
  }

  /**
   * 返回权限校验中间件，用于判断请求是否满足接口权限要求
   * @param { auth?: number[], role?: number[] } options
   */
  checkAuth (options: {
    auth?: number[],
    role?: number[],
  }) {
    return async function (req: Request, res: Response, next: NextFunction) {
      try {
        const { auth, role } = options
        const { tokenUserRoleId, tokenUserAuth } = req.body

        if (auth) {
          // 判断用户权限是否包含全部auth
          for (const authToCheck of auth) {
            if (!tokenUserAuth || !tokenUserAuth.includes(authToCheck)) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Not Authorized')
          }
        }
        if (role) {
          // 判断用户角色是否满足其中一个角色
          if (!role.includes(tokenUserRoleId)) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Not Authorized')
        }
        next()
      } catch (error) {
        next(error)
      }
    }
  }

  /**
   * @deprecated 请使用checkAuth
   */
  requireAuth (auth: number[]) {
    return async function (req: any, res: any, next: any) {
      try {
        const { tokenUserId } = req.body
        const userAuth = await TokenValidator.getAuthOfUserById(tokenUserId)
        if (isError(userAuth)) throw userAuth

        for (const a of auth) {
          if (!userAuth.includes(a)) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Not Authorized')
        }
        req.body.tokenUserAuth = userAuth

        next()
      } catch (error) {
        next(error)
      }
    }
  }

  /**
   * @deprecated 请使用checkAuth
   */
  requireRole (roles: number[]) {
    return async function (req: any, res: any, next: any) {
      try {
        if (roles.includes(req.body.tokenUserRoleId)) next()
        else throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Unauthorized Role')
      } catch (error) {
        next(error)
      }
    }
  }

  /**
   * @deprecated
   */
  static async getAuthOfUserById (id: number) {
    try {
      const auth = await UserAuthModel.findAll({
        where: {
          uid: id,
        },
      })
      return auth.map((a: any) => a.dataValues.aid)
    } catch (error) {
      return error
    }
  }

}

export default new TokenValidator()