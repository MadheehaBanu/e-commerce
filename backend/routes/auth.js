const express = require('express');
const router = express.Router();
const { register, login, getAllUsers, getUserDetails, blockUser } = require('../Controllers/authController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserDetails);
router.put('/users/:id/block', protect, admin, blockUser);

module.exports = router;
