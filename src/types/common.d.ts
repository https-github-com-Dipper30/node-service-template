import { Dialect } from 'sequelize'
export type IAppConfig = {
  PORT: number
  DOMAIN: string
  KEYS: {
    TOKEN_PRIVATE_KEY: string
    TOKEN_PUBLIC_KEY: string
    TOKEN_EXPIRE_IN: number
    MD5_PRIVATE_KEY: string
  }
  DB: IAppDBConfig
}

export type IAppDBConfig = {
  USERNAME: string
  PASSWORD: string
  DATABASE: string
  DIALECT: string
  HOST: string
  DIALECT_OPTION?: any
}

export type DatabaseConfig = {
  username: string
  password: string
  host: string
  dialect: Dialect
  database: string
  dialectOptions?: any
}

export type TokenDecode = {
  uid: number
  rid: number
  iat: number
  exp: number
  auth: number[]
}

export type IException = {
  code: number
  msg: string
}

export interface ExceptionErrorMessage {
  [errCode: number]: string
}
