'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Verificar si ya existe algún cliente en la tabla "Clients"
    const [results] = await queryInterface.sequelize.query('SELECT COUNT(*) as count FROM "Clients";');
    const count = parseInt(results[0].count, 10);

    if (count === 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash('admin123', saltRounds);

      return queryInterface.bulkInsert('Clients', [
        {
          name: 'Administrador',
          lastname: 'Admin',
          ID_number: '000000000', // Valor predeterminado o de prueba
          email: 'admin@example.com',
          password: hashedPassword,
          phone: '0000000000',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]);
    } else {
      console.log("Ya existe un cliente. No se insertará duplicado.");
      return Promise.resolve();
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Clients', { email: 'admin@example.com' }, {});
  }
};
