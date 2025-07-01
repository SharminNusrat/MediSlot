const express = require('express')
const userRouter = express.Router()
const {
    registerUser,
    loginUser, 
    getProfile, 
    updateProfile, 
    bookAppointment, 
    listAppointment, 
    cancelAppointment, 
    paymentSslcommerz, 
    verifyPayment, 
} = require('../controllers/userController')
const { userAuthMiddleware } = require('../middlewares/authUser')
const { upload } = require('../middlewares/multer')

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/profile', userAuthMiddleware, getProfile)
userRouter.put('/update-profile', upload.single('image'), userAuthMiddleware, updateProfile)
userRouter.post('/book-appointment', userAuthMiddleware, bookAppointment)
userRouter.get('/appointments', userAuthMiddleware, listAppointment)
userRouter.post('/cancel-appointment', userAuthMiddleware, cancelAppointment)

userRouter.post('/payment-sslcommerz', userAuthMiddleware, paymentSslcommerz)
userRouter.post('/payment-success', verifyPayment)

module.exports = userRouter