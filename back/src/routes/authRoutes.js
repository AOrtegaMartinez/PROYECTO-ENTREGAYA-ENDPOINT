const express = require('express');
const router = express.Router();
const { registerClient, loginClient } = require('../controllers/authController');

// Ruta para registrar un cliente
router.post('/register', registerClient);

// Ruta para autenticar a un cliente (login)
router.post('/login', loginClient);

module.exports = router;
