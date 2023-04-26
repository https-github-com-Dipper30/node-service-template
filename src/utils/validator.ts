import { ERROR_CODE } from '../constants'
import { AllValidator } from 'aptx-validator'
import { ParameterException } from '../exception'

const emailRE = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
const numericRE = /^\d+$/

export const isPositiveInteger = (n: any): boolean => {
  return Boolean(n) && typeof n == 'number' && n > 0
}

/**
 * check if all the attributes in the object are IDs, which are positive integers
 * @param {object} o
 * @param {string[]} attrs
 * @returns boolean
 */
export const attrsAreIDs = (o: any, attrs: string[]): boolean => {
  if (typeof o != 'object') return false
  for (const a of attrs) {
    // eslint-disable-next-line no-prototype-builtins
    if (o.hasOwnProperty(a) && !isPositiveInteger(o[a])) return false
  }
  return true
}

/**
 * timestamp must be 13 digits number
 */
export const isTimeStamp = (ts: number): boolean => {
  return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 13
}

/**
 * unix timestamp must be 10 digits number
 */
export const isUnixTimeStamp = (ts: number): boolean => {
  return Boolean(ts) && typeof ts == 'number' && ts.toString().length === 10
}

/**
 * check zip code, 5-digit long
 * @param code
 * @returns
 */
export const isZipCode = (code: any): boolean => {
  return Boolean(code) && typeof code == 'number' && code.toString().length == 5
}

/**
 * check if the length of name is between [3, 15]
 * you can use function isBetween of course, but this is more convenient in particular cases
 */
export const isShortName = (p: any): boolean => {
  return isBetween(p, 3, 15)
}

export const stringIsNumeric = (s: string): boolean => {
  return numericRE.test(s)
}

export const stringIsBoolean = (s: string): boolean => {
  return s == 'false' || s == 'true'
}

/**
 * check if the string is numeric
 */
export const isNumeric = (data: any) => {
  return numericRE.test(data)
}

export const isObject = (obj: any): boolean => Object.prototype.toString.call(obj) == '[object Object]'

export const isArray = (arr: any): boolean => Object.prototype.toString.call(arr) == '[object Array]'

export const isString = (str: any): boolean => Object.prototype.toString.call(str) == '[object String]'

export const isNumber = (num: any): boolean => Object.prototype.toString.call(num) == '[object Number]'

export const isBoolean = (num: any): boolean => Object.prototype.toString.call(num) == '[object Boolean]'

/**
 * 正整数
 */
export const isId = (data: any) => {
  return isInteger(data) && data > 0
}

/**
 * 字符串类型的正整数
 */
export const isNumericId = (data: any) => {
  return typeof data === 'string' && /^d+$/g.test(data) && parseInt(data, 10) > 0
}

/**
 * 整数
 */
export const isInteger = (data: any) => {
  return typeof data === 'number' && data % 1 === 0
}

/**
 * if v is null or undefined, return true
 * @param v
 * @returns
 */
export const isEmptyValue = (v: any): boolean => v === null || v === undefined

/**
 * check if the number is between min and max
 * or check if the length of string is between min and max
 */
export const isBetween = (data: any, leftBound: number, rightBound: number, withLeft: boolean = true, withRight: boolean = true) => {
  try {
    if (typeof data === 'string') {
      return (withLeft ? data.length >= leftBound : data.length > leftBound)
        && (withRight ? data.length <= rightBound : data.length > rightBound)
    } else if (typeof data === 'number') {
      return (withLeft ? data >= leftBound : data > leftBound)
        && (withRight ? data <= rightBound : data > rightBound)
    } else return false
  } catch (error) {
    return false
  }
}

export const isEmail = (email: string) => {
  return emailRE.test(email)
}

export const isPassword = (pwd: string) => /^[0-9a-zA-Z!@]{6,18}$/.test(pwd)

export const isUsername = (username: string) => /^((?!\\|\/|:|\*|\?|<|>|\||'|%|@|#|\^|\(|\)|&|-|`).){1,18}$/.test(username)

/**
 * 混淆明文，返回密文
 * @param pt
 * @returns
 */
export const mixMessage = (pt: string) => {
  const ct = []
  let initialOffset = 2
  for (const c of pt) {
    const code = c.charCodeAt(0)
    ct.push(String.fromCharCode(code + initialOffset))
    initialOffset = (initialOffset * 2 + 3) % 33
  }
  return ct.join('')
}

/**
* 将前端混淆的密文解密
* 算法: charCode - offset
*/
export const decryptMessage = (ct: string) => {
  const pt = []
  let initialOffset = 2
  if (!ct) return ''
  for (const c of ct) {
    const code = c.charCodeAt(0)
    pt.push(String.fromCharCode(code - initialOffset))
    initialOffset = (initialOffset * 2 + 3) % 33
  }
  return pt.join('')
}

/**
 * Check an array of Validators.
 * @param {AllValidator[]} validators
 * @returns {boolean | ParameterException} true if all validators pass, ParameterException otherwise
 */
export const checkValidators = (validators: AllValidator[]) => {
  for (const validator of validators) {
    if (!validator.result()) return new ParameterException(null, validator.getErrText())
  }
  return true
}

export const createParameterException = (msg?: string) => {
  return new ParameterException(ERROR_CODE.PARAMETER_ERROR, msg)
}