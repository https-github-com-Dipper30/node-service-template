import { ERROR_CODE } from '@/exceptions/enums';
import BaseException from './BaseException';

class DatabaseException extends BaseException {
  constructor(code?: ERROR_CODE | null, message?: string) {
    super(code ?? ERROR_CODE.DATABASE_ERROR, message);
  }
}

export default DatabaseException;
