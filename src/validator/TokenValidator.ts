import BaseValidator from './BaseValidator'
import jwt from 'jsonwebtoken'
import { AuthException, TokenException } from '@/exception'
import { APP_CONFIG } from '@/config'
import { getUnixTS } from '@/utils'
import { ERROR_CODE } from '@/constants'
import { Request, Response, NextFunction } from 'express'
class TokenValidator extends BaseValidator {
  constructor() {
    super()
  }

  async verifyToken(req: any, res: any, next: any) {
    const { token } = req.headers
    if (!token) throw new TokenException(ERROR_CODE.TOKEN_ERROR, 'Missing Token')

    let decode: any = null
    try {
      decode = jwt.verify(token, APP_CONFIG.KEYS.TOKEN_PRIVATE_KEY) || {}
      if (!decode) new TokenException(ERROR_CODE.TOKEN_PARSE_ERROR)
    } catch (error) {
      throw new TokenException(ERROR_CODE.TOKEN_PARSE_ERROR)
    }
    const { uid, rid, auth, exp } = decode
    const current = getUnixTS()
    if (current > exp) throw new TokenException(ERROR_CODE.TOKEN_EXPIRED)

    // append token info to request body
    req.body.tokenUserId = uid
    req.body.tokenUserRoleId = rid
    req.body.tokenUserAuth = auth

    next()
  }

  /**
   * 返回权限校验中间件，用于判断请求是否满足接口权限要求
   * @param { auth?: number[], role?: number[] } options
   */
  checkAuth(options: { auth?: number[]; role?: number[] }) {
    return async function (req: Request, res: Response, next: NextFunction) {
      const { auth, role } = options
      const { tokenUserRoleId, tokenUserAuth } = req.body

      if (auth) {
        // 判断用户权限是否包含全部auth
        for (const authToCheck of auth) {
          if (!tokenUserAuth || !tokenUserAuth.includes(authToCheck))
            throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Not Authorized')
        }
      }
      if (role) {
        // 判断用户角色是否满足其中一个角色
        if (!role.includes(tokenUserRoleId)) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Not Authorized')
      }

      next()
    }
  }
}

export default new TokenValidator()
