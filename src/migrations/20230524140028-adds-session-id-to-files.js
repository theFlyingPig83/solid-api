'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn('Users', 'session_id', {
      type: Sequelize.UUID,
      allowNull: false
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.removeColumn('Users', 'session_id')
  }
};
