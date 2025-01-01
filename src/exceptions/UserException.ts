import { ERROR_CODE } from '@/exceptions/enums';
import BaseException from './BaseException';

class UserException extends BaseException {
  constructor(code?: ERROR_CODE | null, message?: string) {
    super(code ?? ERROR_CODE.USER_ERROR, message);
  }
}

export default UserException;
