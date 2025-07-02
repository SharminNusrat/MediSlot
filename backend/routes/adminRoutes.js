const express = require('express')
const adminRouter = express.Router()
const {addDoctor, loginAdmin, allDoctors, appointmentsAdmin, cancelAppointmentByAdmin, adminDashboard} = require('../controllers/adminController')
const {adminAuthMiddleware} = require('../middlewares/authAdmin')
const {upload} = require('../middlewares/multer')
const { changeAvailability } = require('../controllers/doctorController')

adminRouter.post('/add-doctor', adminAuthMiddleware, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/all-doctors', adminAuthMiddleware, allDoctors)
adminRouter.put('/change-availability', adminAuthMiddleware, changeAvailability)
adminRouter.get('/appointments', adminAuthMiddleware, appointmentsAdmin)
adminRouter.post('/cancel-appointment', adminAuthMiddleware, cancelAppointmentByAdmin)
adminRouter.get('/dashboard', adminAuthMiddleware, adminDashboard)

module.exports = adminRouter