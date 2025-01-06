import { Dialect } from 'sequelize';

export namespace Custom {
  export type Pagination<T = any> = T & {
    pagination: {
      page?: number;
      size?: number;
    };
  };

  export type Exception = {
    code: number;
    msg: string;
  };

  export type TokenDecode = {
    id: number;
    iat: number;
    exp: number;
  };
}

export namespace Config {
  export type Database = {
    username: string;
    password: string;
    host: string;
    dialect: Dialect;
    database: string;
    dialectOptions?: any;
  };
}
