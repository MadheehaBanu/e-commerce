const express = require('express');
const router = express.Router();
const orderController = require('../Controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/', protect, orderController.createOrder);
router.get('/', protect, orderController.getOrders);
router.get('/:id', protect, orderController.getOrderById);
router.put('/:id/status', protect, orderController.updateStatus); // admin only inside controller

module.exports = router;
