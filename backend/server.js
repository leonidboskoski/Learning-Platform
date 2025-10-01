const express = require("express")
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const bodyParser = require("body-parser")
const userRoutes = require('./routes/userRoutes')
const errorHandler = require("./middleware/errorMiddleware")
const i18n = require('i18n')
const path = require('path')
const cookieParser = require('cookie-parser')
const csurf = require('csurf')

dotenv.config()

connectDB()

const app = express()
const PORT = process.env.PORT || 5000

i18n.configure({
    locales: ['en', 'mk'],
    directory: path.join(__dirname,'locales'),
    defaultLocale: 'en',
    cookie: 'lang',
    header: 'accept-language',
    autoReload: true,
    syncFiles: true,
    objectNotation: true,
    register: global
})

app.use(bodyParser.json())

app.use(cookieParser())

app.use(i18n.init)

const csrfProtection = csurf({ cookie: true })

app.get('/',(req,res) => {
    res.json({ message: 'API is running...' })
})

app.use('/api/users', userRoutes)

app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({
            code: 'AUTH.INVALID_CSRF_TOKEN',
            message: req.__('AUTH.INVALID_CSRF_TOKEN'),
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        })
    } else {
        next(err)
    }
})

app.use(errorHandler)

app.listen(PORT,() => {
    console.log(`Server running on the port ${PORT}`)
})

module.exports = csrfProtection
