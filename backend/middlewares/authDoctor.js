const jwt = require('jsonwebtoken')

const doctorAuthMiddleware = async (req, res, next) => {
    try {
        const {doctortoken} = req.headers 
        if(!doctortoken) {
            return res.status(400).json({
                success: false, 
                message: 'Not authorized, login again'
            })
        }

        const token_decode = jwt.verify(doctortoken, process.env.JWT_SECRET)
        console.log(token_decode)
        
        req.docId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {doctorAuthMiddleware}