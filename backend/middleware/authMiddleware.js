const jwt = require('jsonwebtoken')
const asyncHandler = require('../utils/asyncHandler')

const User = require('../models/User')

const protect = asyncHandler(async(req,res,next) => {
    let token;

    if(req.cookies.jwt){
        try{
            token = req.cookies.jwt

            const decoded = jwt.verify(token,process.env.JWT_SECRET)

            req.user = await User.findById(decoded.id).select('-password')

            if(!req.user){
                res.status(401)
                throw new Error('AUTH.USER_NOT_FOUND_TOKEN')
            }

            next()
        } catch (error) {
            console.error('Token verification error: ', error.message);
            res.status(401);
            throw new Error('AUTH.INVALID_TOKEN')
        }
    }
    else{
        res.status(401)
        throw new Error('AUTH.NO_TOKEN')
    }
})

module.exports = { protect }