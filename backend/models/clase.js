'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Clase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Clase.belongsTo(models.User, {foreignKey: 'userID',as: 'user'})
    }
  }
  Clase.init({
    userID: DataTypes.INTEGER,
    Nombre: DataTypes.STRING,
    Hora: DataTypes.TIME,
    Telefono: DataTypes.STRING,
    Fecha: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Clase',
  });
  return Clase;
};