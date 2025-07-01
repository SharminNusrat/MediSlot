const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config()
const connectDB = require('./config/mongodb')
const connectCloudinary = require('./config/cloudinary')
const adminRouter = require('./routes/adminRoutes')
const doctorRouter = require('./routes/doctorRoutes')
const { registerUser } = require('./controllers/userController')
const userRouter = require('./routes/userRoutes')

const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/api/admin', adminRouter)
app.use('/api/doctor', doctorRouter)
app.use('/api/user', userRouter)

app.get('/', (req, res) => {
    res.send('Welcome to Prescripto!')
})

app.listen(port, () => {
    console.log(`Server running at port:${port}`)
})