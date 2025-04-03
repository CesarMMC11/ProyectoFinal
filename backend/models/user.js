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
      // Asociaciones existentes
      User.hasMany(models.Clase, {foreignKey: 'userID', as: 'clases'})
      User.hasMany(models.Reserva, {foreignKey: 'userID', as: 'reservas'})
      User.hasMany(models.Torneo, {foreignKey: 'userID', as: 'torneos'})
      
      // Nuevas asociaciones para la funcionalidad de amistad
      
      // Solicitudes de amistad enviadas
      User.hasMany(models.Friendship, {
        as: 'sentFriendRequests',
        foreignKey: 'requesterId'
      });
      
      // Solicitudes de amistad recibidas
      User.hasMany(models.Friendship, {
        as: 'receivedFriendRequests',
        foreignKey: 'addresseeId'
      });
      
      // Amigos (usuarios que han aceptado la solicitud)
      User.belongsToMany(models.User, {
        through: models.Friendship,
        as: 'friends',
        foreignKey: 'requesterId',
        otherKey: 'addresseeId',
        scope: {
          status: 'accepted'
        }
      });
      
      // Amigos (usuarios que me han enviado solicitud y he aceptado)
      User.belongsToMany(models.User, {
        through: models.Friendship,
        as: 'friendsOf',
        foreignKey: 'addresseeId',
        otherKey: 'requesterId',
        scope: {
          status: 'accepted'
        }
      });
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
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'User',
  });

  return User;
};
