'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class RoleAuthority extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Authority.belongsToMany(models.Role, {
        through: RoleAuthority,
        unique: false,
        foreignKey: 'aid',
        // hooks: true,
      })
      models.Role.belongsToMany(models.Authority, {
        through: RoleAuthority,
        unique: false,
        foreignKey: 'rid',
        as: 'auth',
        // hooks: true,
      })
    }

    /**
     * 返回角色id绑定的权限数组
     * @param {number} id
     * @returns {number[]}
     */
    static async getAuthByRoleId(id) {
      const auth = await RoleAuthority.findAll({
        where: { rid: id },
      })
      return auth.map(a => a.dataValues.aid)
    }
  }
  RoleAuthority.init(
    {
      rid: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      aid: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'RoleAuthority',
    },
  )
  return RoleAuthority
}
