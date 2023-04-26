'use strict'
const {
  Model,
} = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class EventTrack extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate (models) {
      // define association here
      EventTrack.belongsTo(models.User, { foreignKey: 'uid', targetKey: 'id', as: 'user' })
    }
  }
  EventTrack.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
      type: DataTypes.STRING,
    },
    code: DataTypes.STRING,
    createdAt: DataTypes.INTEGER,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'EventTrack',
  })
  return EventTrack
}