require("dotenv").config();
const { Sequelize } = require("sequelize");

console.log("DATABASE_URL:", process.env.DATABASE_URL); // Verifica que no sea undefined

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

module.exports = sequelize;
