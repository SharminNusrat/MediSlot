const doctorModel = require("../models/doctorModel")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const appointmentModel = require('../models/appointmentModel')

const changeAvailability = async (req, res) => {
    try {
        const { docId } = req.body

        const doctorData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available: !doctorData.available })
        res.json({
            success: true,
            message: 'Availability changed'
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password', '-email'])

        res.json({
            success: true,
            doctors
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const loginDoctor = async (req, res) => {
    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({
                success: false,
                message: 'Doctor does not exist'
            })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const appointmentsDoctor = async (req, res) => {
    try {
        const { docId } = req
        const appointments = await appointmentModel.find({ docId })

        console.log('appointments', appointments)
        res.json({
            success: true,
            appointments
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const appointmentComplete = async (req, res) => {
    try {
        const { docId } = req
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId == docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({
                success: true,
                message: 'Appointment completed'
            })
        } else {
            return res.json({
                success: false,
                message: 'Mark failed'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const appointmentCancel = async (req, res) => {
    try {
        const { docId } = req
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId == docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({
                success: true,
                message: 'Appointment cancelled'
            })
        } else {
            return res.json({
                success: false,
                message: 'Cancellation failed'
            })
        }
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const doctorDashboard = async (req, res) => {
    try {
        const { docId } = req
        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashboardData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse().slice(0, 5)
        }

        res.json({ success: true, dashboardData })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const doctorProfile = async (req, res) => {
    try {
        const { docId } = req
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const updateDoctorProfile = async (req, res) => {
    try {
        const {docId} = req
        const { fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile updated' })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {
    changeAvailability,
    doctorList,
    loginDoctor,
    appointmentsDoctor,
    appointmentComplete,
    appointmentCancel,
    doctorDashboard,
    doctorProfile,
    updateDoctorProfile,
}