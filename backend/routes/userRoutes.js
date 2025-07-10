const express = require('express')
const router = express.Router()

const {
    registerUser,
} = require('../controllers/userControllers')

// --- Public Routes ---
// These routes do not require any authentication (for now).

// POST /api/users/register
// Route for registering a new user (both Teacher and Student)
router.post('/register', registerUser);

module.exports = router