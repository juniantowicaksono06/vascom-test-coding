'use strict';

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
    await queryInterface.bulkInsert('products', [
      {
        nama: "Enodia1",
        harga: 100000000,
        product_status: "ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia2",
        harga: 100000000,
        product_status: "ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia3",
        harga: 100000000,
        product_status: "ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia4",
        harga: 100000000,
        product_status: "ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia5",
        harga: 100000000,
        product_status: "ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia6",
        harga: 100000000,
        product_status: "ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia7",
        harga: 100000000,
        product_status: "NOT_ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia8",
        harga: 100000000,
        product_status: "NOT_ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia9",
        harga: 100000000,
        product_status: "NOT_ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia10",
        harga: 100000000,
        product_status: "NOT_ACTIVE",
        gambar: 'default.jpg'
      },
      {
        nama: "Enodia11",
        harga: 100000000,
        product_status: "NOT_ACTIVE",
        gambar: 'default.jpg'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('products', null, {});
  }
};
