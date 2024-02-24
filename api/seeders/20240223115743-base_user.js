'use strict';

const crypto = require('crypto')
const {createHash} = crypto

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await queryInterface.bulkInsert('users', [
      {
        password: createHash('sha256').update("Admin1234").digest('hex'),
        fullname: "Admin",
        telpon: "081354070748",
        email: "juniantowicaksono22@gmail.com",
        role: "ADMIN",
        user_status: "ACTIVE"
      },
      {
        password: createHash('sha256').update("Abcd1234").digest('hex'),
        fullname: "User",
        telpon: "085254874393",
        email: "derpcat469@gmail.com",
        role: "USER",
        user_status: "ACTIVE"
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users', null, {});
  }
};
