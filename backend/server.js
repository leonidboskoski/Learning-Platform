const express = require("express")
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const bodyParser = require("body-parser")
const userRoutes = require('./routes/userRoutes')
const errorHandler = require("./middleware/errorMiddleware")
const i18n = require('i18n')
const path = require('path')

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

app.use(i18n.init);

app.get('/',(req,res) => {
    res.send('API is running...')
})

app.use('/api/users',userRoutes)

app.use(errorHandler);

app.listen(PORT,() => {
    console.log(`Server running on the port ${PORT}`)
})