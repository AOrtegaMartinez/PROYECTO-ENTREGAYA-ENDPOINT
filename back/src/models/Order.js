const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("../config"); // Conexión a la base de datos
const Client = require("./Client");
const OrderStatus = require("./OrderStatus");
const { v4: uuidv4 } = require('uuid'); // Se importa uuid para generar códigos únicos

// Se crea el modelo Order, 
// este modelo se utiliza para definir la estructura de la tabla Client en la base de datos utilizando Sequelize. 
// Este modelo especifica los campos y sus propiedades, 
// así como las validaciones necesarias para cada campo. 
const Order = sequelize.define("Order", {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,     // Se usa como clave primaria, única para cada registro
    autoIncrement: true,  // Genera un valor único y secuencial para cada nuevo registro
  },
  orderCode: {
    type: DataTypes.UUID, 
    defaultValue: uuidv4, // Genera un UUID automáticamente
    allowNull: false,     // Se valida que el campo no sea nulo
    unique: true          // Se valida que el código sea único
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,     // Se valida que el campo no sea nulo
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,     // Se valida que el campo no sea nulo
  },
  ID_number: {
    type: DataTypes.STRING,
    allowNull: false,    // Se valida que el campo no sea nulo
  },
  department: {
    type: DataTypes.STRING,
    allowNull: false,    // Se valida que el campo no sea nulo
  },
  municipality: {
    type: DataTypes.STRING,
    allowNull: false,    // Se valida que el campo no sea nulo
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,    // Se valida que el campo no sea nulo
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,    // Se valida que el campo no sea nulo
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,    // Se valida que el campo no sea nulo
    validate: {
      isEmail: true,     // Se valida que el campo sea un email
    },
  },
  package_type: {
    type: DataTypes.ENUM("documentos", "paquetes"),   // Se valida que la entrada solo sea documentos o paquetes
    allowNull: false,       // Se valida que el campo no sea nulo
  },
  destination_department: {
    type: DataTypes.STRING,
    allowNull: false,      // Se valida que el campo no sea nulo
  },
  destination_municipality: {
    type: DataTypes.STRING,
    allowNull: false,      // Se valida que el campo no sea nulo
  },
  recipient_name: {
    type: DataTypes.STRING,
    allowNull: false,      // Se valida que el campo no sea nulo
  },
  destination_address: {
    type: DataTypes.STRING,
    allowNull: false,     // Se valida que el campo no sea nulo
  },
  creation_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Se genera la fecha actual
  },
  current_status: {
    type: DataTypes.INTEGER,
    allowNull: false,      // Se valida que el campo no sea nulo
    references: {
      model: OrderStatus,  // Se hace referencia al modelo OrderStatus
      key: "status_id",    // Se hace referencia a la clave primaria de OrderStatus
    },
  },
  client_id: {
    type: DataTypes.INTEGER,
    allowNull: false,     // Se valida que el campo no sea nulo
    references: {
      model: Client,     // Se hace referencia al modelo Client
      key: "id",         // Se hace referencia a la clave primaria de Client
    },
  },
}, {
  timestamps: true,
});

// Asociaciones
Order.belongsTo(Client, { foreignKey: "client_id", as: "client" });  // Un pedido pertenece a un cliente
Order.belongsTo(OrderStatus, { foreignKey: "current_status", as: "status" });  // Un pedido tiene un estado

module.exports = Order;
