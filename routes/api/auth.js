const express = require("express");
const auth = require("../../middleware/auth")

// Require Bcrypt
const bcrypt = require("bcrypt")

// implement JWT
const jwt = require("jsonwebtoken")

// Config
const config = require("config")

// Validate user input
const { check, validationResult } = require("express-validator")

const router = express.Router()

const User = require("../../models/User")

// @route       GET api/auth
// @desc        Test route
// @access      Public
router.get("/", auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password")
        res.json(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error")
    }
})


// @route       POST api/auth
// @desc        Authenticate user and get token
// @access      Public
router.post("/", [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Pull out stuff from req.body
    const {email, password} = req.body

    try {
         // See if user exists
         let user = await User.findOne({ email })
         if (!user) {
            return res.status(200).json({ errors: [{ msg: "Invalid credentials" }] })
         }

         const isMatch = await bcrypt.compare(password, user.password)

         if (!isMatch) {
            return res.status(200).json({ errors: [{ msg: "Invalid credentials" }] })
         }

        // get the payload which includes the user id
        const payload = {
            user: {
                id: user.id
            }
        }

        // Sign the token - pass in the payload, jwtSecret
        jwt.sign(payload, config.get("jwtSecret"), {expiresIn: 360000}, (err, token) => {
            if (err) {
                throw err
            }
            res.json({ token })
        })

    } catch (error) {
        console.log(error.message)
        res.status(500).send("Server error")
    }
})

module.exports = router;