import { ERROR_CODE } from '@/exceptions/enums';
import BaseException from './BaseException';

class TokenException extends BaseException {
  constructor(code?: ERROR_CODE | null, message?: string) {
    super(code ?? ERROR_CODE.TOKEN_ERROR, message);
  }
}

export default TokenException;
