// server.js
// This is the main entry point for our Express application.
// It sets up the server, connects to MongoDB, and connects the routes.

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

app.use(cookieParser()); // Must be before csurf

app.use(i18n.init); // Must be before routes/controllers using req.__()

const csrfProtection = csurf({ cookie: true });

// NEW PLACEMENT: Apply csrfProtection globally AFTER cookie-parser and i18n.init
// This ensures req.csrfToken() is available for all subsequent routes.
app.use(csrfProtection); // <--- MOVED HERE

app.get('/',(req,res) => {
    // Now req.csrfToken() will be available here because csrfProtection runs globally
    res.json({ message: 'API is running...', csrfToken: req.csrfToken() });
});

app.use('/api/users', userRoutes) // This now gets CSRF protection automatically

// Custom CSRF error handling middleware (must be after csurf)
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        res.status(403).json({
            code: 'AUTH.INVALID_CSRF_TOKEN',
            message: req.__('AUTH.INVALID_CSRF_TOKEN'),
            stack: process.env.NODE_ENV === 'production' ? null : err.stack,
        });
    } else {
        next(err);
    }
});

app.use(errorHandler);

app.listen(PORT,() => {
    console.log(`Server running on the port ${PORT}`)
})
