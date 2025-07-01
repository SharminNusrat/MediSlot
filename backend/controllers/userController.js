const express = require('express')
const validator = require('validator')
const bcrypt = require('bcrypt')
const userModel = require('../models/userModel')
const appointmentModel = require('../models/appointmentModel')
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModel')
const cloudinary = require('cloudinary').v2
const sslcommerz = require('sslcommerz-lts')

const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing details' })
        }

        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Enter a valid email' })
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'Enter a strong password' })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({
            success: true,
            token
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: 'User does not exist'
            })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
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

const getProfile = async (req, res) => {
    try {
        const { userId } = req
        const userData = await userModel.findById(userId).select('-password')
        res.json({ success: true, userData })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const updateProfile = async (req, res) => {
    try {
        const { userId } = req
        const { name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: 'Data missing' })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' })
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageUrl })
        }

        res.json({
            success: true,
            message: 'Profile updated'
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const bookAppointment = async (req, res) => {
    try {
        const { userId } = req
        const { docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select('-password')
        console.log('docid ' + docId)

        if (!docData.available) {
            return res.json({
                success: false,
                message: 'Doctor not available'
            })
        }

        let slots_booked = docData.slots_booked

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({
                    success: false,
                    message: 'Slot not available'
                })
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointment = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointment)
        await newAppointment.save()

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })
        // const updatedDoc = await doctorModel.findById(docId)
        // console.log('Updated slots:', updatedDoc.slots_booked)

        res.json({
            success: true,
            message: 'Appointment booked'
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const listAppointment = async (req, res) => {
    try {
        const { userId } = req
        const appointments = await appointmentModel.find({ userId })

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

const cancelAppointment = async (req, res) => {
    try {
        const { userId } = req
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment cancelled' })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const sslcz_store_id = process.env.SSLCOMMERZ_STORE_ID
const sslcz_store_password = process.env.SSLCOMMERZ_STORE_PASSWORD
const is_live = false
const sslcz = new sslcommerz(sslcz_store_id, sslcz_store_password, is_live)

const paymentSslcommerz = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment cancelled or not found' })
        }

        const data = {
            total_amount: appointmentData.amount,
            currency: 'BDT',
            tran_id: appointmentId, // use unique tran_id for each api call
            success_url: 'http://localhost:4000/api/user/payment-success',
            fail_url: 'http://localhost:3030/fail',
            cancel_url: 'http://localhost:3030/cancel',
            ipn_url: 'http://localhost:3030/ipn',
            shipping_method: 'Courier',
            product_name: 'Appointment Payment.',
            product_category: 'Appointment',
            product_profile: 'general',
            cus_name: 'Customer Name',
            cus_email: 'customer@example.com',
            cus_add1: 'Dhaka',
            cus_add2: 'Dhaka',
            cus_city: 'Dhaka',
            cus_state: 'Dhaka',
            cus_postcode: '1000',
            cus_country: 'Bangladesh',
            cus_phone: '01711111111',
            cus_fax: '01711111111',
            ship_name: 'Customer Name',
            ship_add1: 'Dhaka',
            ship_add2: 'Dhaka',
            ship_city: 'Dhaka',
            ship_state: 'Dhaka',
            ship_postcode: 1000,
            ship_country: 'Bangladesh',
        }

        // console.log('data', data)

        // order creation
        const order = await sslcz.init(data)
        console.log(order)

        res.json({
            success: true,
            order
        })
    } catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: error.message
        })
    }
}

const verifyPayment = async (req, res) => {
    const { val_id, tran_id } = req.body;  
    console.log('val_id:', val_id);
    console.log('tran_id:', tran_id);

    if (!val_id || !tran_id) {
        return res.status(400).send('Missing val_id or tran_id');
    }

    try {
        const validation = await sslcz.validate({ val_id });

        console.log('Payment validated:', validation);

        await appointmentModel.findByIdAndUpdate(tran_id, { payment: true });

        res.redirect('http://localhost:5173/my-appointments?payment=success');
    } catch (error) {
        console.log(error);
        res.status(500).send('Validation failed');
    }
}

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    paymentSslcommerz,
    verifyPayment
}