'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Clase, {foreignKey: 'userID',as: 'clases'})
      User.hasMany(models.Reserva, {foreignKey: 'userID',as: 'reservas'})
      User.hasMany(models.Torneo, {foreignKey: 'userID',as: 'torneos'})
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    lastname: DataTypes.STRING,
    description: DataTypes.STRING,
    profileImg: DataTypes.STRING,
    coverImg: DataTypes.STRING,
    rol: {
      type: DataTypes.ENUM('admin', 'user'),
      defaultValue: 'user',
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};