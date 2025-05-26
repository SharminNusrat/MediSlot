const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/mongodb')

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())
app.use(cors())
connectDB()

app.get('/', (req, res) => {
    res.send('Welcome to Prescripto!')
})

app.listen(port, () => {
    console.log(`Server running at port:${port}`)
})