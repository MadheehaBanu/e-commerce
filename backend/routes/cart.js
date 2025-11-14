const express = require('express');
const router = express.Router();
const cartController = require('../Controllers/cartController');
const { protect } = require('../middleware/auth');

router.get('/', protect, cartController.getCart);
router.post('/add', protect, cartController.addToCart);
router.put('/update', protect, cartController.updateCart);
router.delete('/remove', protect, cartController.removeFromCart);

module.exports = router;
