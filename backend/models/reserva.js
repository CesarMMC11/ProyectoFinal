'use strict';

const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Reserva extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Reserva.belongsTo(models.User, {foreignKey: 'userID', as: 'user'})
    }
  }
  
  Reserva.init({
    userID: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User',
        key: 'id'
      }
    },
    fecha: DataTypes.DATEONLY,
    nombre: DataTypes.STRING,
    apellido: DataTypes.STRING,
    hora: DataTypes.TIME,
    telefono: DataTypes.STRING,
    email: DataTypes.STRING,
    paymentStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'unpaid',
      validate: {
        isIn: [['unpaid', 'pending', 'paid']]
      }
    }
  }, {
    sequelize,
    modelName: 'Reserva',
  });
  
  return Reserva;
};
