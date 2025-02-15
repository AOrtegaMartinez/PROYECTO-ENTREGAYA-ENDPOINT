const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Conexión a la base de datos

// Se crea el modelo Client, 
// este modelo se utiliza para definir la estructura de la tabla Client en la base de datos utilizando Sequelize. 
// Este modelo especifica los campos y sus propiedades, 
// así como las validaciones necesarias para cada campo. 
const Client = sequelize.define('Client', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,     // Se usa como clave primaria, única para cada registro
    autoIncrement: true,  // Genera un valor único y secuencial para cada nuevo registro
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,    // Se valida que el campo no sea nulo
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,    // Se valida que el campo no sea nulo
  },
  ID_number: {
    type: DataTypes.STRING,
    allowNull: false,   // Se valida que el campo no sea nulo
    unique: true,       // Se valida qe Ee número de identificación sea único, en este caso el número de cédula
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,   // Se valida que el campo no sea nulo
    unique: true,       // Se valida que el email sea único
    validate: {
      isEmail: true,    // Se valida que el campo sea un email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,   // Se valida que el campo no sea nulo
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,   // Se valida que el campo no sea nulo
  },
}, {
  timestamps: true,
});


module.exports = Client;