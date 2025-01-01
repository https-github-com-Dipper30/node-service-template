import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenException } from '@/exceptions';
import { APP_CONFIG } from '@/config';
import { getUnixTS } from '@/utils';
import { ERROR_CODE } from '@/exceptions/enums';

const tokenVerifier = (req: Request, res: Response, next: NextFunction) => {
  // ignore path
  if (
    [
      '/api/v1/login',
      '/api/v1/autoLogin',
      '/api/v1/usernameAvailability',
    ].includes(req.path)
  ) {
    return next();
  }

  const { token } = req.headers;
  if (!token || typeof token !== 'string')
    throw new TokenException(ERROR_CODE.TOKEN_ERROR, 'Missing Token');

  let decode: any = null;
  try {
    decode = jwt.verify(token, APP_CONFIG.KEYS.TOKEN_PRIVATE_KEY) || {};
    if (!decode) new TokenException(ERROR_CODE.TOKEN_PARSE_ERROR);
  } catch (error) {
    throw new TokenException(ERROR_CODE.TOKEN_PARSE_ERROR);
  }
  const { id, rid, auth, exp } = decode;
  const current = getUnixTS();
  if (current > exp) throw new TokenException(ERROR_CODE.TOKEN_EXPIRED);

  // append user data to request
  req.user = {
    id,
    rid: rid || 0,
    auth: auth || [],
  };

  next();
};

export default tokenVerifier;
