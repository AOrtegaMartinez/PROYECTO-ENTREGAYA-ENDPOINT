const express = require('express');
const clientController = require('../controllers/clientController');

const router = express.Router();

// Obtener todos los clientes
router.get('/', clientController.getAllClients);

// Obtener un cliente por ID
router.get('/:id', clientController.getClientById);

// Eliminar un cliente por ID
router.delete('/:id', clientController.deleteClient);

module.exports = router;
