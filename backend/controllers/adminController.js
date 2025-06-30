const validator = require('validator')
const bcrypt = require('bcrypt')
const cloudinary = require('cloudinary').v2
const jwt = require('jsonwebtoken')
const doctorModel = require('../models/doctorModel')

const addDoctor = async (req, res) => {
    try {
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file

        console.log(req.body);

        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.status(400).json({
                success: false,
                message: 'Missing details'
            })
        }

        if(!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: 'Please enter a valid email'
            })
        }

        if(password.length < 8) {
            return res.json({
                success: false,
                message: 'Please enter a strong password'
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type: 'image'})
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name, 
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree, 
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()

        return res.json({
            success: true,
            message: 'Doctor added!'
        })

    } catch (error) {
        console.log(error)
        return res.json({
            success: false,
            message: error.message
        })
    }
}

const loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body
        
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            return res.status(200).json({
                success: true, 
                token
            })
        } 
        else {
            return res.json({
                success: false,
                message: 'Invalid credentials'
            })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
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

module.exports = {addDoctor, loginAdmin, allDoctors}