'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Consulta para obtener el número de registros en la tabla OrderStatuses
    const [results, metadata] = await queryInterface.sequelize.query('SELECT COUNT(*) as count FROM "OrderStatuses";');
    const count = parseInt(results[0].count, 10);

    if (count === 0) {
      // Si la tabla está vacía, inserta los estados
      return queryInterface.bulkInsert('OrderStatuses', [
        { name: 'Pending', createdAt: new Date(), updatedAt: new Date() },
        { name: 'In transit', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Delivered', createdAt: new Date(), updatedAt: new Date() },
        { name: 'Canceled', createdAt: new Date(), updatedAt: new Date() },
      ]);
    } else {
      console.log("Los estados de orden ya existen. No se insertarán duplicados.");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('OrderStatuses', null, {});
  }
};
