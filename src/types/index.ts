/// <reference types="node" />
export * from './api'
export * from './common'

export type TAccount = {
  username: string
  password: string
}

export type TUserSimpleProfile = {
  id: number,
  username: string,
  avatar: string,
}

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>