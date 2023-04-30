import { ERROR_CODE } from '@/constants'
import { AuthException, DatabaseException, UserException } from '@/exception'
import { encryptMD5, getTS } from '@/utils'
import BaseService from './BaseService'
import { Op } from 'sequelize'
const models = require('@/db/models')
const {
  User: UserModel,
  Role: RoleModel,
  Authority: AuthModel,
  RoleAuthority: RoleAuthModel,
  UserAuthority: UserAuthModel,
  sequelize,
} = models

class Auth extends BaseService {
  constructor() {
    super()
  }

  /**
   * 查询 username 是否存在
   * @param username
   * @param ignoreCase 是否忽略大小写查询, 默认忽略
   * @returns {boolean}
   */
  async isUsernameExisting(username: string, ignoreCase: boolean = true) {
    // mysql查询默认不区分大小写
    UserModel.findOne({
      where: {
        username: '1',
      },
    })
    const usernameQuery = ignoreCase
      ? sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), username.toLowerCase())
      : { username }
    const user = await UserModel.findOne({
      where: usernameQuery,
      attributes: ['id', 'username'],
    })
    return !!user
  }

  async loginAccount(p: { username: string; password: string }) {
    const { username, password } = p
    const encryptedPassword = await encryptMD5(password)
    const user = await UserModel.findOne({
      where: {
        username: sequelize.where(sequelize.fn('LOWER', sequelize.col('username')), username.toLowerCase()),
        password: encryptedPassword,
      },
      include: [
        {
          model: RoleModel,
          as: 'role',
        },
      ],
      attributes: ['id', 'username'],
    })

    if (!user) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'User Not Found')

    // 附带用户auth字段
    const auth = await this.getAuthByUserId(user.id)
    type PickUser = Pick<typeof user, 'id' | 'username' | 'password'>
    type RoleAttribute = { role: { id: number; name: string } }
    const data = {
      ...(user.dataValues as unknown as PickUser & RoleAttribute),
      auth,
    }
    return data
  }

  async getUserById(id: number) {
    const user = await UserModel.findByPk(id, {
      include: [
        {
          model: RoleModel,
          as: 'role',
        },
        {
          model: AuthModel,
          as: 'auth',
        },
        {
          model: UserModel,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
      attributes: { exclude: ['password', 'destroyed', 'updatedAt'] },
    })
    if (!user) throw new UserException(ERROR_CODE.USER_NOT_FOUND)
    return user.dataValues
  }

  async getUsers(p: { id?: number; username?: string; rid?: number; page: number; size: number }) {
    const { id, username, rid, page, size } = p
    const where: any = {}
    if (id) where.id = id
    if (username) where.username = username
    if (rid) where.rid = rid

    const criteria = {
      where,
      include: [
        {
          model: RoleModel,
          as: 'role',
        },
        {
          model: AuthModel,
          as: 'auth',
        },
        {
          model: UserModel,
          as: 'creator',
          attributes: ['id', 'username'],
        },
      ],
      attributes: { exclude: ['password'] },
      limit: size,
      offset: (page - 1) * size,
      distinct: true,
    }
    const users = await UserModel.findAndCountAll(criteria)
    return users
  }

  async updateUserAuth(p: { uid: number; auth: number[] }) {
    const t = await sequelize.transaction()
    try {
      const user = await UserModel.findByPk(p.uid)
      if (!user) throw new AuthException(ERROR_CODE.USER_NOT_FOUND)

      await UserAuthModel.destroy({
        where: { uid: user.id },
        transaction: t,
      })
      const records = p.auth.map(a => ({ uid: user.id, aid: a }))
      await UserAuthModel.bulkCreate(records, { transaction: t })
      await t.commit()
      user.updatedAt = getTS()
      await user.save()
      return true
    } catch (error) {
      await t.rollback()
      throw new DatabaseException()
    }
  }

  async updateUserInfo(p: { tokenUserId: number; username?: string; password?: string; newPassword?: string }) {
    const user = await UserModel.findByPk(p.tokenUserId)
    if (!user) throw new AuthException(ERROR_CODE.USER_NOT_FOUND)

    if (p.username && p.username != user.username) {
      const exists = await this.isUsernameExisting(p.username)
      if (exists) throw new AuthException(ERROR_CODE.USER_EXISTS, '用户名已存在')
      user.username = p.username
    }

    if (p.newPassword && p.password) {
      if (encryptMD5(p.password) != user.dataValues.password)
        throw new AuthException(ERROR_CODE.AUTH_ERROR, '密码不正确')
      user.password = encryptMD5(p.newPassword)
    }

    await user.save()
    const newUser: any = await UserModel.findByPk(p.tokenUserId, {
      include: [
        {
          model: RoleModel,
          as: 'role',
        },
      ],
      attributes: ['id', 'username', 'rid'],
    })
    if (!newUser) throw new UserException(ERROR_CODE.USER_NOT_FOUND)

    // 附带用户auth字段
    const auth = await this.getAuthByUserId(user.id)

    const data = {
      ...newUser.dataValues,
      auth,
      role: newUser.role,
    }
    return data
  }

  async getAuthByUserId(uid: number): Promise<number[]> {
    const auth = await UserAuthModel.findAll({
      where: { uid },
    })
    if (!auth) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Auth Not Found')
    return auth.map((a: any) => a.dataValues.aid)
  }

  /**
   * 创建管理员账号
   */
  async createAccount(p: { username: string; password: string; rid: number; cid?: number }) {
    const t = await sequelize.transaction()
    try {
      const { username, password, rid, cid } = p
      // 判断创建账号的角色是否为管理员类型（包含权限1)
      const authOfRole = await RoleAuthModel.findAll({ where: { rid: p.rid, aid: 1 } })
      if (!authOfRole || authOfRole.length == 0) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Unauthorized Role')

      // 判断用户名是否已被占用
      const usernameExists = await this.isUsernameExisting(username)
      if (usernameExists !== false) {
        throw new AuthException(ERROR_CODE.USER_EXISTS)
      }
      const currentTS = getTS()

      const user = await UserModel.create(
        {
          username,
          password: encryptMD5(password),
          rid,
          cid,
          destroyed: false,
          createdAt: currentTS,
          updatedAt: currentTS,
        },
        { transaction: t },
      )
      if (!user) throw new DatabaseException(ERROR_CODE.DATABASE_ERROR, 'Fail To Create New User')

      // 获取角色默认权限
      const roleAuthModels = await RoleAuthModel.findAll({ where: { rid } })
      const records = roleAuthModels.map((a: any) => ({ uid: user.id as number, aid: a.dataValues.aid }))
      // 添加权限
      await UserAuthModel.bulkCreate(records, { transaction: t })

      await t.commit()
      return user.id
    } catch (error) {
      await t.rollback()
      throw error
    }
  }

  async getAuthorities(p: { id?: number; name?: string; rid?: number }) {
    const { id, name } = p

    const criteria: { id?: number; name?: string } = {}
    if (id) criteria.id = Number(id)
    if (name) criteria.name = name

    const auth =
      (await AuthModel.findAll({
        where: criteria,
        order: ['id'],
      })) || []

    return auth
  }

  async createAuthority(p: { id: number; name: string; description: string }) {
    const { id, name, description } = p

    const idExists = await AuthModel.findByPk(id)
    if (idExists) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'auth already exists')

    const auth = await AuthModel.create({
      id,
      name,
      description: description ?? '',
    })

    return auth
  }

  async updateAuthority(p: { id: number; name?: string; description?: string }) {
    const { id, name, description } = p

    const auth = await AuthModel.findByPk(id)
    if (!auth) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Auth Not Found')

    if (name) auth.name = name
    if (description) auth.description = description
    await auth.save()

    return auth
  }

  async createRole(p: { id: number; name: string; description?: string; auth: number[] }) {
    const t = await sequelize.transaction()
    const { id, name, description, auth } = p
    const roleExisting = await RoleModel.findByPk(id)
    if (roleExisting) throw new AuthException(ERROR_CODE.ROLE_ERROR, 'role exists')

    try {
      const role = await RoleModel.create(
        {
          id,
          name,
          description: description ?? '',
        },
        { transaction: t },
      )
      if (!role) throw new AuthException(ERROR_CODE.ROLE_ERROR)

      // 创建新的role auth映射关系
      const items = auth.map(a => ({ rid: role.id, aid: a }))
      await RoleAuthModel.bulkCreate(items, { transaction: t })

      await t.commit()
      return { ...role.dataValues, auth }
    } catch (error) {
      await t.rollback()
      throw error
    }
  }

  /**
   * 获取角色列表, 在拥有权限3的情况下可以获取角色绑定的所有权限值
   * @param p
   * @returns
   */
  async getRoles(p: { id?: number; name?: string }) {
    const { id, name } = p

    const criteria: { id?: number; name?: string } = {}
    if (id) criteria.id = Number(id)
    if (name) criteria.name = name

    const roles = await RoleModel.findAll({
      where: criteria,
      include: [{ model: AuthModel, as: 'auth' }],
      order: ['id'],
    })

    return roles
  }

  /**
   * 仅获取管理员角色
   */
  async getAdminRoles() {
    const roleAuths = await RoleAuthModel.findAll({ where: { aid: 1 } })
    const rids = roleAuths.map((r: any) => r.rid)
    const roles = await RoleModel.findAll({
      where: {
        id: { [Op.in]: rids },
      },
      include: [{ model: AuthModel, as: 'auth' }],
      order: ['id'],
    })

    return roles
  }

  async updateRole(p: { id: number; name?: string; description?: string; auth: [] }) {
    const { id, name, description, auth } = p

    const role = await RoleModel.findByPk(id)
    if (!role) throw new AuthException(ERROR_CODE.AUTH_ERROR, 'Role Not Found')

    if (name) role.name = name
    if (description) role.description = description
    if (auth) {
      const items = auth.map(a => ({ rid: role.id, aid: a }))
      await RoleAuthModel.destroy({
        where: { rid: role.id },
      })
      await RoleAuthModel.bulkCreate(items)
      await role.save()
    }
    const newAuth = await RoleAuthModel.getAuthByRoleId(role.id)
    return { ...role.dataValues, auth: newAuth }
  }
}

export default new Auth()
