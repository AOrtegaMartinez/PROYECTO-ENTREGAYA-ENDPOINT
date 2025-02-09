const { Sequelize } = require('sequelize'); // Se importa la clase Sequelize
require('dotenv').config(); // Se importa la configuración de dotenv

// Aquí se configura y establece la conexión 
// a la base de datos utilizando Sequelize. 
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Nombre de la base de datos
  process.env.DB_USER,     // Usuario
  process.env.DB_PASSWORD, // Contraseña
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Desactivar logs para mantener la consola limpia
  }
);

module.exports = sequelize;