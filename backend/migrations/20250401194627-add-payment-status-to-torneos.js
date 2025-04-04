'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Torneos', 'paymentStatus', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: 'unpaid'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Torneos', 'paymentStatus');
  }
};
