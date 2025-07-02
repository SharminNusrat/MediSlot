const express = require('express')
const {doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile} = require('../controllers/doctorController')
const { doctorAuthMiddleware } = require('../middlewares/authDoctor')
const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appointments', doctorAuthMiddleware, appointmentsDoctor)
doctorRouter.post('/complete-appointment', doctorAuthMiddleware, appointmentComplete)
doctorRouter.post('/cancel-appointment', doctorAuthMiddleware, appointmentCancel)
doctorRouter.get('/dashboard', doctorAuthMiddleware, doctorDashboard)
doctorRouter.get('/profile', doctorAuthMiddleware, doctorProfile)
doctorRouter.post('/update-profile', doctorAuthMiddleware, updateDoctorProfile)

module.exports = doctorRouter