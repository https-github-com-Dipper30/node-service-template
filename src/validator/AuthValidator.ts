import { Request, Response, NextFunction } from 'express'
import BaseValidator from './BaseValidator'
import { createParameterException, decryptMessage, checkValidators, isPassword } from '@/utils/validator'
import { isError } from '@/utils'
import { validate } from 'aptx-validator'

class AuthValidator extends BaseValidator {
  constructor() {
    super()
  }

  postLogin(req: Request, res: Response, next: NextFunction) {
    req.body.password = decryptMessage(req.body.password)
    const validators = [
      validate(req.body.username).string().errText('invalid email'),
      validate(req.body.password).string().validate(isPassword).errText('invalid password'),
    ]
    const result = checkValidators(validators)
    if (isError(result)) throw result
    next()
  }

  postAutoLogin(req: Request, res: Response, next: NextFunction) {
    const { token } = req.body
    const validator = validate(token).required().string().errText('Invalid Token')
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  getUser(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query
    const validator = validate(id).required().string().numeric().errText('Invalid ID')
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  getUsers(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.query)
      .object()
      .rules({
        id: validate().string().numeric().errText('Invalid ID'),
        username: validate()
          .string()
          .useRE(/^[0-9a-zA-Z]{4,18}$/)
          .errText('Invalid Username'),
        rid: validate().string().numeric().errText('Invalid ID'),
        page: validate().string().numeric().errText('Invalid Page'),
        size: validate().string().numeric().errText('Invalid Size'),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  getUsernameAvailability(req: Request, res: Response, next: NextFunction) {
    const { username } = req.query
    const validator = validate(username)
      .required()
      .string()
      .useRE(/^[0-9a-zA-Z]{4,18$/)
      .errText('Invalid ID')
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  postAccount(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.body)
      .object()
      .rules({
        username: validate()
          .required()
          .string()
          .useRE(/^[0-9a-zA-Z]{4,18}$/)
          .errText('Invalid Username'),
        password: validate()
          .required()
          .string()
          .useRE(/^[0-9a-zA-Z!@]{6,18}$/)
          .errText('Invalid Password'),
        rid: validate().required().number().id().errText('Invalid ID'),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  putUserAuth(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.body)
      .object()
      .rules({
        uid: validate().required().number().id().errText('Invalid UID'),
        auth: validate().required().array('number').errText('Invalid Auth'),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  putUser(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.body)
      .object()
      .rules({
        username: validate()
          .string()
          .useRE(/^[0-9a-zA-Z]{4,18}$/)
          .errText('Invalid Username'),
        password: validate()
          .string()
          .useRE(/^[0-9a-zA-Z!@]{6,18}$/)
          .errText('Invalid Password'),
        newPassword: validate()
          .string()
          .useRE(/^[0-9a-zA-Z!@]{6,18}$/)
          .errText('Invalid New Password'),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  postAuthority(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.body)
      .object()
      .rules({
        id: validate().required().number().id().errText('Invalid Username'),
        name: validate().string().errText('Invalid Name'),
        description: validate().string(),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  getAuthorities(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.query)
      .object()
      .rules({
        id: validate().string().numeric().errText('Invalid ID'),
        name: validate().string().errText('Invalid Name'),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  putAuthority(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.body)
      .object()
      .rules({
        id: validate().required().number().id().errText('Invalid Username'),
        name: validate().string().errText('Invalid Name'),
        description: validate().string(),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  postRole(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.body)
      .object()
      .rules({
        id: validate().required().number().id().errText('Invalid Username'),
        name: validate().string().errText('Invalid Name'),
        description: validate().string(),
        auth: validate().required().array('number').errText('Invalid Auth'),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  getRoles(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.query)
      .object()
      .rules({
        id: validate().string().numeric().errText('Invalid ID'),
        name: validate().string().errText('Invalid Name'),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }

  putRole(req: Request, res: Response, next: NextFunction) {
    const validator = validate(req.body)
      .object()
      .rules({
        id: validate().required().number().id().errText('Invalid Username'),
        name: validate().string().errText('Invalid Name'),
        description: validate().string(),
        auth: validate().array('number').errText('Invalid Auth'),
      })
    if (!validator.result()) throw createParameterException(validator.getErrText())
    next()
  }
}

export default new AuthValidator()
