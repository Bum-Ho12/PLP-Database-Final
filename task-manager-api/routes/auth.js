const express = require('express');
const router = express.Router();
const {
    register, login, getCurrentUser,
    updateUserProfile,
    deleteUserAccount
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

// Register a new user
router.post('/register', register);

// Login user
router.post('/login', login);

// Get current user (protected route)
router.get('/me', authenticateUser, getCurrentUser);

// Update user profile (protected route)
router.put('/me', authenticateUser, updateUserProfile);

// Delete user account (protected route)
router.delete('/me', authenticateUser, deleteUserAccount);

module.exports = router;