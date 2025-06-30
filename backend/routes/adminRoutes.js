const express = require('express')
const adminRouter = express.Router()
const {addDoctor, loginAdmin, allDoctors} = require('../controllers/adminController')
const {adminAuthMiddleware} = require('../middlewares/authAdmin')
const {upload} = require('../middlewares/multer')
const { changeAvailability } = require('../controllers/doctorController')

adminRouter.post('/add-doctor', adminAuthMiddleware, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.get('/all-doctors', adminAuthMiddleware, allDoctors)
adminRouter.put('/change-availability', adminAuthMiddleware, changeAvailability)

module.exports = adminRouter