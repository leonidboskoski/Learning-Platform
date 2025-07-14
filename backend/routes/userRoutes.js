const express = require('express');
const router = express.Router();

const {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getUserById,
    updateUserProfile,
    deleteUser,
    changePassword
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// --- Public Routes ---
router.post('/register', registerUser);
router.post('/login', loginUser);

// --- Protected Routes ---
// IMPORTANT: Place more specific routes BEFORE more general ones with parameters.

// PUT /api/users/change-password - Specific route for password change
router.put('/change-password', protect, changePassword); // <--- MOVED THIS UP

// POST /api/users/logout - Requires authentication to clear the cookie
router.post('/logout', protect, logoutUser);

// GET /api/users
router.get('/', protect, getAllUsers);

// GET /api/users/:id
router.get('/:id', protect, getUserById);

// PUT /api/users/:id - General route for profile updates (excluding password)
router.put('/:id', protect, updateUserProfile); // <--- THIS NOW COMES AFTER /change-password

// DELETE /api/users/:id
router.delete('/:id', protect, deleteUser);

module.exports = router;
