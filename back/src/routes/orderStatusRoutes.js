const express = require('express');
const router = express.Router();
const { getOrderStatuses, createOrderStatus, updateOrderStatus, deleteOrderStatus } = require('../controllers/orderStatusController');

// Obtener todos los estados de las órdenes
router.get('/', getOrderStatuses);

// Crear un nuevo estado de orden
router.post('/', createOrderStatus);

// Actualizar un estado de orden
router.put('/:id', updateOrderStatus);

// Eliminar un estado de orden
router.delete('/:id', deleteOrderStatus);

module.exports = router;
