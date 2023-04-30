import BaseService from './BaseService'
import jwt from 'jsonwebtoken'
import { APP_CONFIG } from '@/config'
import { TokenException } from '@/exception'
import { ERROR_CODE } from '@/constants'
import { getUnixTS } from '@/utils'
import { TokenDecode } from '@/types'

class Token extends BaseService {
  constructor() {
    super()
  }

  /**
   * 对用户id, rid, auth进行加密生成token
   * @param account
   * @returns
   */
  async generateToken(account: { id: number; rid: number; auth: number[] }) {
    const { id, rid, auth } = account
    try {
      const token = jwt.sign({ uid: id, rid, auth }, APP_CONFIG.KEYS.TOKEN_PRIVATE_KEY, {
        expiresIn: APP_CONFIG.KEYS.TOKEN_EXPIRE_IN,
      })
      return token
    } catch (error) {
      throw new TokenException(ERROR_CODE.TOKEN_ERROR, 'Token Generator Error')
    }
  }

  async verifyToken(token: string) {
    if (!token) throw new TokenException(ERROR_CODE.TOKEN_ERROR, 'Missing Token')
    let decode: TokenDecode | null = null
    try {
      decode = jwt.verify(token, APP_CONFIG.KEYS.TOKEN_PRIVATE_KEY) as TokenDecode
    } catch (error) {
      throw new TokenException(ERROR_CODE.TOKEN_PARSE_ERROR)
    }
    const current = getUnixTS()
    const { exp } = decode
    // check if token has expired
    if (current > exp) throw new TokenException(ERROR_CODE.TOKEN_EXPIRED)
    return decode
  }
}

export default new Token()
