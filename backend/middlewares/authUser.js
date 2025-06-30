const jwt = require('jsonwebtoken')

const userAuthMiddleware = async (req, res, next) => {
    try {
        const {token} = req.headers 
        if(!token) {
            return res.status(400).json({
                success: false, 
                message: 'Not authorized, login again'
            })
        }

        const token_decode = jwt.verify(token, process.env.JWT_SECRET)
        console.log(token_decode)
        
        req.userId = token_decode.id
        next()

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {userAuthMiddleware}