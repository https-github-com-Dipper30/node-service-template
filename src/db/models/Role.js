'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Role.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
      },
      description: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Role',
    },
  )
  return Role
}
