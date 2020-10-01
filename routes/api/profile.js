const express = require("express");

const router = express.Router()
const auth = require("../../middleware/auth")

// Profile model
const Profile = require("../../models/Profile")
const User = require("../../models/User")

// @route       GET api/profile/me
// @desc        Get current user's profile
// @access      Private - add auth as a second parameter to protect the route
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({
            user: req.user.id
        }).populate("user", ["name", "avatar"])

        // Check if there is no profile
        if(!profile){
            return res.status(400).json({ msg: "There is no profile for this user" })
        }
        // If there is a profile
        res.json(profile)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }
})

module.exports = router;