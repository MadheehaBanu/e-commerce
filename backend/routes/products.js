const express = require('express');
const router = express.Router();
const productController = require('../Controllers/productController');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// public
router.get('/', productController.getProducts);
router.get('/:id', productController.getProduct);
router.get('/:id/related', productController.getRelatedProducts);

// admin routes
router.post('/', protect, admin, productController.createProduct);
router.put('/:id', protect, admin, productController.updateProduct);
router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
