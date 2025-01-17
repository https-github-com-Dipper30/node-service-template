import { ERROR_CODE, ERROR_TEXT } from '@/exceptions/enums';
import { Custom } from '@/types';

class BaseException extends Error implements Custom.Exception {
  code: number;
  msg: string;

  constructor(code?: ERROR_CODE, message?: string) {
    super();
    this.code = code ?? 500;
    this.msg = message ?? ERROR_TEXT[this.code as ERROR_CODE];
  }
}

export default BaseException;
