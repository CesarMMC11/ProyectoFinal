'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Torneos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userID: {
        type: Sequelize.INTEGER
      },
      fecha: {
        type: Sequelize.DATEONLY
      },
      nombre: {
        type: Sequelize.STRING
      },
      invitado: {
        type: Sequelize.STRING
      },
      hora: {
        type: Sequelize.TIME
      },
      telefono: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Torneos');
  }
};