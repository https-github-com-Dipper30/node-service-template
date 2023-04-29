'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Role, { foreignKey: 'rid', targetKey: 'id', as: 'role' })
      User.belongsTo(models.User, { foreignKey: 'cid', targetKey: 'id', as: 'creator' })
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        require: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
        validate: {
          isEmail: {
            msg: 'Must be a valid email address',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        require: true,
      },
      avatar: DataTypes.STRING,
      rid: DataTypes.INTEGER,
      cid: DataTypes.INTEGER,
      destroyed: DataTypes.BOOLEAN,
      createdAt: DataTypes.BIGINT,
      updatedAt: DataTypes.BIGINT,
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'User',
    },
  )
  return User
}
