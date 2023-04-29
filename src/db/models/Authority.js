'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Authority extends Model { }
  Authority.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        unique: true,
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
      modelName: 'Authority',
    },
  )
  return Authority
}
