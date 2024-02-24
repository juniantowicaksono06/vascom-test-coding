'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      fullname: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      telpon: {
        type: Sequelize.STRING(13),
        allowNull: false,
        unique: true
      },
      email: {
        type: Sequelize.STRING(200),
        allowNull: false,
        unique: true
      },
      role: {
        type: Sequelize.ENUM("ADMIN", "USER"),
        allowNull: false,
      },
      user_status: {
        type: Sequelize.ENUM('ACTIVE', 'NOT_ACTIVE', 'PENDING'),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    queryInterface.dropTable('users');
  }
};
