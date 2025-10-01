const express = require('express');
const router = express.Router();
const csurf = require('csurf');

const csrfProtection = csurf({ cookie: true });

const {
    registerUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getUserById,
    updateUserProfile,
    deleteUser,
    changePassword,
    getCsrfToken 
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

// The ID regex definition has been completely removed as requested.

// ------------------------------------
// 1. Public Routes (No Auth, No CSRF Check)
// ------------------------------------

// POST /api/users/register - Issues session cookie
router.post('/register', registerUser);

// POST /api/users/login - Issues session cookie
router.post('/login', loginUser); 

// ------------------------------------
// 2. Protected Routes (Require Auth, Selective CSRF Check)
// ------------------------------------

// GET /api/users/csrf-token - Dedicated route to fetch the token after login/register
// Requires authentication and CSRF to generate and provide the token.
router.get('/csrf-token', protect, csrfProtection, getCsrfToken);


// GET /api/users - Get all users (Needs Auth)
router.get('/', protect, getAllUsers);

// POST /api/users/logout - Clears the cookie. Requires Auth + CSRF to modify session state.
router.post('/logout', protect, csrfProtection, logoutUser); 

// PUT /api/users/change-password - Specific path. Requires Auth + CSRF.
router.put('/change-password', protect, csrfProtection, changePassword);

// GET /api/users/:id - Get a user by ID. Uses standard path parameter.
router.get('/:id', protect, getUserById);

// PUT /api/users/:id - Update user profile. Uses standard path parameter. Requires Auth + CSRF.
router.put('/:id', protect, csrfProtection, updateUserProfile);

// DELETE /api/users/:id - Delete user. Uses standard path parameter. Requires Auth + CSRF.
router.delete('/:id', protect, csrfProtection, deleteUser);


module.exports = router;
