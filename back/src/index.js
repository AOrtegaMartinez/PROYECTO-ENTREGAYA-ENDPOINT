require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const { sendContactMessage } = require('./mailer');

// Rutas existentes
const orderRoutes = require('./routes/orderRoutes');
const clientRoutes = require('./routes/clientRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

const app = express();

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://project-entregaya-final.onrender.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Middleware para parsear JSON
app.use(express.json());

// Rutas de la API
app.use('/api/orders', orderRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Ruta para manejar mensajes de contacto
app.post('/api/contact', async (req, res) => {
  const formData = req.body;

  try {
    await sendContactMessage(formData);
    res.status(200).json({ message: 'Mensaje enviado exitosamente.' });
  } catch (error) {
    console.error('Error al enviar el mensaje:', error);
    res.status(500).json({ error: 'Error al enviar el mensaje. Intenta nuevamente.' });
  }
});

// Sincronizar la base de datos y levantar el servidor
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log('Base de datos sincronizada');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al sincronizar la base de datos:', error);
  });
