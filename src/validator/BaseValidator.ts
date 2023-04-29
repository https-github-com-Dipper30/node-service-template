import { ERROR_CODE } from '../constants'
import { ParameterException } from '../exception'

class BaseValidator {
  constructor() {
    //
  }

  createError(msg: string = 'Parameter Error'): ParameterException {
    return new ParameterException(ERROR_CODE.PARAMETER_ERROR, msg)
  }
}

export default BaseValidator
