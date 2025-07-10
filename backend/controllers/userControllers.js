const User = require('../models/User')
const bcrypt = require('bcryptjs')

const asyncHandler = (fn) => (req,res,next) =>
    Promise.resolve(fn(req,res,next)).catch(next)

// @desc    Register a new user (Teacher or Student)
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req,res) => {
    const { userType, email, password, name, bio, subjects, highSchoolUniversity, bonusCredits} = req.body

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(409)
        throw new Error('USER.VALIDATION.EMAIL_EXISTS')
    }

    if(!['Teacher', 'Student'].includes(userType)){
        res.status(400)
        throw new Error('USER.VALIDATION.USER_TYPE_INVALID')
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
        userType,
        email,
        password: hashedPassword,
        name
    }

    if(userType === 'Teacher'){
        userData.bio = bio || ''
        userData.subjects = subjects || []
    } else if (userType === 'Student'){
        userData.highSchoolUniversity = highSchoolUniversity || ''
        userData.bonusCredits = bonusCredits || 0
    }

    const user = await User.create(userData)

    if(user){
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
                updatedAt: user.updatedAt
            }
        })
    }
    else {
        res.status(400);
        throw new Error('COMMON.SERVER_ERROR'); 
    }
})

module.exports = {registerUser}