'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Reservas', 'paymentStatus', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'unpaid'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Reservas', 'paymentStatus');
  }
};
