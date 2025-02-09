const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const sequelize = require('./config');
const { sendContactMessage } = require('./mailer'); // Importar la función de contacto

// Rutas existentes
const orderRoutes = require('./routes/orderRoutes');
const clientRoutes = require('./routes/clientRoutes');
const orderStatusRoutes = require('./routes/orderStatusRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

// Se invoca dotenv, para cargar las variables de entorno.
dotenv.config();

// Se invoca express, para crear el servidor.
const app = express();

// se configura CORS, para para permitir solicitudes
// desde el origen http://localhost:5173 y para permitir 
// los métodos HTTP GET, POST, PUT, y DELETE, 
// así como los encabezados Content-Type y Authorization.
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/api/orders', orderRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/order-statuses', orderStatusRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Ruta para manejar mensajes de contacto
app.post('/api/contact', async (req, res) => {
  const formData = req.body;

  try {
    // Llama a la función de envío de mensajes de contacto
    await sendContactMessage(formData);
    res.status(200).json({ message: 'Mensaje enviado exitosamente.' });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje. Intenta nuevamente.' });
  }
});

// Sincronizar la base de datos y levantar el servidor
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(3000, () => {
      console.log('Servidor corriendo en http://localhost:3000');
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });
