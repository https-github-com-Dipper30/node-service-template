import { ERROR_CODE } from '@/exceptions/enums';
import BaseException from './BaseException';

class AuthException extends BaseException {
  constructor(code?: ERROR_CODE | null, message?: string) {
    super(code ?? ERROR_CODE.AUTH_ERROR, message);
  }
}

export default AuthException;
