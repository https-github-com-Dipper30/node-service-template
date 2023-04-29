'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class UserAuthority extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Authority.belongsToMany(models.User, {
        through: UserAuthority,
        unique: false,
        foreignKey: 'aid',
        // hooks: true,
      })
      models.User.belongsToMany(models.Authority, {
        through: UserAuthority,
        unique: false,
        foreignKey: 'uid',
        as: 'auth',
        // hooks: true,
      })
    }
  }
  UserAuthority.init(
    {
      uid: {
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
      modelName: 'UserAuthority',
    },
  )
  return UserAuthority
}
