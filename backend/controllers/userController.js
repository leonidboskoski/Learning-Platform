const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs'); // We are now using this for password hashing
const generateToken = require('../utils/generateToken'); // Import the JWT generation utility
const asyncHandler = require('../utils/asyncHandler'); // Import your custom asyncHandler

// @desc    Register a new user (Teacher or Student)
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { userType, email, password, name, bio, subjects, highSchoolUniversity, bonusCredits } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(409);
        throw new Error('USER.VALIDATION.EMAIL_EXISTS');
    }

    if (!['Teacher', 'Student'].includes(userType)) {
        res.status(400);
        throw new Error('USER.VALIDATION.USER_TYPE_INVALID');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
        userType,
        email,
        password: hashedPassword,
        name,
    };

    if (userType === 'Teacher') {
        userData.bio = bio || '';
        userData.subjects = subjects || [];
    } else if (userType === 'Student') {
        userData.highSchoolUniversity = highSchoolUniversity || '';
        userData.bonusCredits = bonusCredits || 0;
    }

    const user = await User.create(userData);

    if (user) {
        res.cookie('jwt', generateToken(user._id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            message: req.__mf('USER.MESSAGES.REGISTERED_SUCCESSFULLY', { userType: user.userType }),
            user: {
                id: user._id,
                userType: user.userType,
                email: user.email,
                name: user.name,
                ...(user.userType === 'Teacher' && {
                    bio: user.bio,
                    subjects: user.subjects,
                    rating: user.rating,
                    achievements: user.achievements
                }),
                ...(user.userType === 'Student' && {
                    highSchoolUniversity: user.highSchoolUniversity,
                    bonusCredits: user.bonusCredits
                }),
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            csrfToken: req.csrfToken()
        });
    } else {
        res.status(400);
        throw new Error('COMMON.SERVER_ERROR');
    }
});

// @desc    Login a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('AUTH.INVALID_CREDENTIALS');
    }

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.cookie('jwt', generateToken(user._id), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'Lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: req.__('USER.MESSAGES.LOGIN_SUCCESSFUL'),
            user: {
                id: user._id,
                userType: user.userType,
                email: user.email,
                name: user.name,
            },
            csrfToken: req.csrfToken()
        });
    } else {
        res.status(401);
        throw new Error('AUTH.INVALID_CREDENTIALS');
    }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private (now protected)
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
});

// @desc    Get a single user by ID
// @route   GET /api/users/:id
// @access  Private (now protected)
const getUserById = asyncHandler(async (req, res) => {
    // We can still use req.params.id to fetch *any* user if the authenticated user
    // is allowed to view others (e.g., an admin).
    // If a user should only view their OWN profile, change 'req.params.id' to 'req.user._id'.
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error('USER.MESSAGES.USER_NOT_FOUND');
    }
});

// @desc    Update a user's profile
// @route   PUT /api/users/:id
// @access  Private (requires authentication)
const updateUserProfile = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const updates = req.body;

    if (updates.password) {
        res.status(400);
        throw new Error('USER.VALIDATION.PASSWORD_UPDATE_NOT_ALLOWED');
    }

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select('-password');

    if (user) {
        res.status(200).json({
            message: req.__('USER.MESSAGES.USER_UPDATED_SUCCESSFULLY'),
            user: user
        });
    } else {
        res.status(404);
        throw new Error('USER.MESSAGES.USER_NOT_FOUND');
    }
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private (requires authentication)
const deleteUser = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    const user = await User.findByIdAndDelete(userId);

    if (user) {
        res.status(200).json({
            message: req.__('USER.MESSAGES.USER_DELETED_SUCCESSFULLY')
        });
    } else {
        res.status(404);
        throw new Error('USER.MESSAGES.USER_NOT_FOUND');
    }
});

// NEW FUNCTION: @desc Change user's password
// @route   PUT /api/users/change-password
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
        res.status(400);
        throw new Error('USER.VALIDATION.PASSWORD_FIELDS_REQUIRED');
    }

    if (newPassword.length < 6) { 
        res.status(400);
        throw new Error('USER.VALIDATION.PASSWORD_TOO_SHORT');
    }

    const user = await User.findById(userId);

    if (!user) {
        res.status(404);
        throw new Error('USER.MESSAGES.USER_NOT_FOUND');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
        res.status(401); 
        throw new Error('AUTH.INCORRECT_CURRENT_PASSWORD');
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt); 

    await user.save();

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    res.status(200).json({
        message: req.__('USER.MESSAGES.PASSWORD_CHANGED_SUCCESSFULLY'),
    });
});

// @desc    Logout user / clear cookie
// @route   POST /api/users/logout
// @access  Private (A user must be logged in to log out their session)
const logoutUser = asyncHandler(async (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0), 
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
    });

    res.status(200).json({ message: req.__('USER.MESSAGES.LOGOUT_SUCCESSFUL') });
});

module.exports = {
    registerUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUserProfile,
    deleteUser,
    changePassword,
    logoutUser
}
