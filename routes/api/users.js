const express = require("express");
const router = express.Router() 

// Require gravatar
const gravatar = require("gravatar")

// Require Bcrypt
const bcrypt = require("bcrypt")

// implement JWT
const jwt = require("jsonwebtoken")

// Config
const config = require("config")

// Validate user input
const { check, validationResult } = require("express-validator")

// Get the user model
const User = require("../../models/User")

// @route       POST api/users
// @desc        Register user
// @access      Public
router.post("/", [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Please enter a password with 6 or more characters").isLength({
        min: 6
    }),
], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // Pull out stuff from req.body
    const {name, email, password} = req.body

    try {
         // See if user exists
         let user = await User.findOne({ email })
         if (user) {
            return res.status(200).json({ errors: [{ msg: "User already exist!" }] })
         }

        // Get user avatar
         const avatar = gravatar.url(email, {
             s: "200",
             r: "pg",
             d: "mm"
         })

        //  Create an instance of the user with the avatar
        user = new User({name, email, avatar, password})

        // Create a salt to hash password with
        const salt = await bcrypt.genSalt(10)

        // Encrypt password
        user.password = await bcrypt.hash(password, salt)

        // Save user to db
        await user.save()

        // // Return JWT
        // res.send("User registered")

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