'use strict'
const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class CurrentActiveUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      CurrentActiveUser.belongsTo(models.User, { foreignKey: 'uid', targetKey: 'id', as: 'user' })
    }
  }
  CurrentActiveUser.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: DataTypes.INTEGER,
    username: DataTypes.STRING,
    avatar: DataTypes.STRING,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'CurrentActiveUser',
  })
  return CurrentActiveUser
}