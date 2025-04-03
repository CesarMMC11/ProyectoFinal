'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Torneo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Torneo.belongsTo(models.User, {foreignKey: 'userID',as: 'user'})
    }
  }
  Torneo.init({
    userID: DataTypes.INTEGER,
    fecha: DataTypes.DATEONLY,
    nombre: DataTypes.STRING,
    invitado: DataTypes.STRING,
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
    modelName: 'Torneo',
  });
  return Torneo;
};