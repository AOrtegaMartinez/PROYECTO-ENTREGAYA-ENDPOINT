const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateJWT = require('../middlewares/authenticatejWT');

// Crear una nueva orden
router.post('/', authenticateJWT, orderController.createOrder);

// Obtener todas las órdenes
router.get('/', authenticateJWT, orderController.getOrders);

// Obtener una orden por ID
router.get('/:id', authenticateJWT, orderController.getOrderById);

// Rastrear una orden por uuid
router.get('/track/:uuid', orderController.trackOrderByUuid);

// Actualizar el estado de una orden
router.put('/:id/status', authenticateJWT, orderController.updateOrderStatus);

// Cancelar una orden
router.put('/:id/cancel', authenticateJWT, orderController.cancelOrder);

// Actualizar una orden completa
router.put('/:id/update', authenticateJWT, orderController.updateOrder); // Nueva ruta

// Eliminar una orden
router.delete('/:id', authenticateJWT, orderController.deleteOrder);

module.exports = router;
