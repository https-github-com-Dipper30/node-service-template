import {
  UserModel,
  RoleModel,
  AuthModel,
  RoleAuthModel,
  sequelize,
} from '@/db/models';

export default class BaseService {
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
  }

  get activeUserModel() {
    return this.models.user.scope('active');
  }
}
