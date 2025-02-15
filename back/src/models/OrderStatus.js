const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

// Se crea el modelo OrderStatus, 
// este modelo se utiliza para definir la estructura de la tabla Client en la base de datos utilizando Sequelize. 
// Este modelo especifica los campos y sus propiedades, 
// así como las validaciones necesarias para cada campo. 
const OrderStatus = sequelize.define('OrderStatus', {
  status_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,  // Se genera un id incremental de manera automática
  },
  name: {
    type: DataTypes.ENUM('Pending', 'In transit', 'Delivered', 'Canceled'), // Se Definen los estados posibles
    allowNull: false,  // Se valida que siempre haya un nombre de estado
  }
}, {
  tableName: 'OrderStatuses', // Asegurar que el nombre de la tabla coincide exactamentes
  timestamps: true,
});

module.exports = OrderStatus;
