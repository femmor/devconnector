const jwt = require("jsonwebtoken")
const config = require("config")


module.exports = function(req, res, next){
    // Get the token from the header
    var token = req.header('x-auth-token')

    // Check if no token
    if(!token) {
        return res.status(401).json({ msg: "No token, authorization denied"});
    }
    // If there's token, verify the token
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret"))
        req.user = decoded.user
        next()
    } catch (error) {
        res.status(401).json({ msg: "Token is not valid" })
    }

}