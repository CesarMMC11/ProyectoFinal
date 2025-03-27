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
    userID: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    Nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Hora: {
      type: DataTypes.TIME,
      allowNull: false
    },
    Telefono: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Fecha: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Clase',
  });
  return Clase;
};