import { ERROR_CODE, PROCESS_ENV } from '../constants'
import BaseException from '../exception/BaseException'
import crypto from 'crypto'
import moment from 'moment'
import { ENV_VARIABLE } from '@/constants'
import { APP_CONFIG } from '@/config'
export * from './log'
export * from './validator'

/**
 * MD5加密
 * @param {string} plainText
 * @returns {string} 密文
 */
export const encryptMD5 = (plainText: string): string => {
  return crypto.createHash('md5').update(plainText).update(APP_CONFIG.KEYS.MD5_PRIVATE_KEY).digest('hex')
}

/**
 * 获取当前 UNIX 时间戳
 * @returns 10位时间戳(秒)
 */
export const getUnixTS = (): number => {
  return Math.floor(new Date().getTime() / 1000)
}

/**
 * 获取当前时间戳
 * @returns {number} 13位时间戳(毫秒)
 */
export const getTS = (): number => {
  return new Date().getTime()
}

/**
 * 获取当天零点时的 UNIX 时间戳
 */
export const getMidnightUnixTS = (): number => {
  const ts = getTS()
  const currentDate = moment(ts)
  const hours = currentDate.hours()
  const minutes = currentDate.minutes()
  const seconds = currentDate.seconds()
  return Math.floor((ts - hours * 3600 * 1000 - minutes * 60 * 1000 - seconds * 1000) / 1000)
}

/**
 * 获取当天零点时的时间戳
 */
export const getMidnightTS = (): number => {
  const ts = getTS()
  const currentDate = moment(ts)
  const hours = currentDate.hours()
  const minutes = currentDate.minutes()
  const seconds = currentDate.seconds()
  return ts - hours * 3600 * 1000 - minutes * 60 * 1000 - seconds * 1000
}

/**
 * 获取当月 UNIX 时间戳
 * @param {prevMonth} 往前递推的月数 0-当月 1-一个月前 -1-下一个月
 */
export const getMonthUnixTS = (prevMonth: number = 0): number => {
  return moment().subtract(prevMonth, 'months').startOf('month').unix()
}

/**
 * 根据时间戳返回日期字符串
 * @param {number|undefined|null} ts 13位时间戳，可以为空，则默认为当前时间戳
 * @param {string} format 指定日期格式，可以为空，默认为'YY-MM-DD hh:mm:ss'
 * @returns 日期字符串
 */
export const generateDateByTs = (ts: number | undefined | null, format: string = 'YY-MM-DD hh:mm:ss'): string => {
  if (!ts) ts = getTS()
  return moment(ts).format(format)
}

/**
 * 判断参数是否为Error或自定义异常的实例
 * @param {any} p
 * @returns {boolean}
 */
export const isError = (p: any): boolean => {
  return p instanceof BaseException || p instanceof Error
}

/**
 * 判断node环境
 */
export const isEnv = (env: PROCESS_ENV): boolean => {
  return getEnv() === env
}

export const getEnv = (): PROCESS_ENV => {
  const env = process.env.NODE_ENV?.trim() || ''
  if (env === PROCESS_ENV.DEVELOPMENT || env === PROCESS_ENV.SIMULATION || env === PROCESS_ENV.PRODUCTION) return env
  else return PROCESS_ENV.UNKNOWN
}

export const getConfig = (attribute: ENV_VARIABLE) => {
  return process.env[attribute] || ''
}

export const wrapJSON = (code: ERROR_CODE | 200 | 201 | 500, msg: string, data?: any) => ({
  code,
  msg,
  data: data ?? null,
})

/**
 * 判断数据是否为Enum的其中一个值
 * @returns boolean
 */
export const isEnum = (value: any, enumType: any) => {
  const values = Object.values(enumType)
  return values.includes(value)
}
