const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authenticateJWT = require('../middlewares/authenticatejWT'); // Usar tu middleware

// Ruta para obtener el perfil del cliente
router.get('/', authenticateJWT, profileController.getProfile);

// Ruta para actualizar el perfil del cliente
router.put('/', authenticateJWT, profileController.updateProfile);

module.exports = router;
