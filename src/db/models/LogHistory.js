'use strict'
const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class LogHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      LogHistory.belongsTo(models.User, { foreignKey: 'uid', targetKey: 'id', as: 'user' })
    }
  }
  LogHistory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: DataTypes.STRING,
    },
    log_type: DataTypes.ENUM('login', 'logout', 'home'),
    createdAt: DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'LogHistory',
  })
  return LogHistory
}