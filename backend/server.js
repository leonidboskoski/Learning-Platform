const express = require("express")
const dotenv = require("dotenv")
const connectDB = require('./config/db')
const bodyParser = require("body-parser")

dotenv.config()
connectDB()

const app = express()
const PORT = process.env.PORT || 5000

app.use(bodyParser.json())

app.get('/',(req,res) => {
    res.send('API is running...')
})

app.listen(PORT,() => {
    console.log(`Server running on the port ${PORT}`)
})