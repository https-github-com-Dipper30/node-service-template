import {
  UserModel,
  RoleModel,
  AuthModel,
  RoleAuthModel,
  sequelize,
} from '@/db/models';
import { Op } from 'sequelize';

export default class BaseService {
  Op: typeof Op;
  models: {
    user: typeof UserModel;
    role: typeof RoleModel;
    auth: typeof AuthModel;
    roleAuth: typeof RoleAuthModel;
  };
  sequelize;

  constructor() {
    this.models = {
      user: UserModel,
      role: RoleModel,
      auth: AuthModel,
      roleAuth: RoleAuthModel,
    };
    this.sequelize = sequelize;
    this.Op = Op;
  }

  get activeUserModel() {
    return this.models.user.scope('active');
  }
}
