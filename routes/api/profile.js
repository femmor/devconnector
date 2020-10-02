const express = require("express");

const router = express.Router()
const auth = require("../../middleware/auth")

// Profile model
const Profile = require("../../models/Profile")
const User = require("../../models/User")

// Validate user 
const { check, validationResult } = require("express-validator")

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

// @route       POST api/profile
// @desc        Create/update a user's profile
// @access      Private - add auth as a second parameter to protect the route

router.post("/", [auth, [
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    // If validation passes, pull out stuff from req.body

    const {
        company,
        website,
        location,
        bio, 
        status,
        githubUsername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedIn,
    } = req.body

    // Build profile object
    const profileFields = {}

    // Set the user to the user id
    profileFields.user = req.user.id

    // assign field values
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(bio) profileFields.bio = bio
    if(status) profileFields.status = status
    if(githubUsername) profileFields.githubUsername = githubUsername
    // Turn skills to an array of strings
    if(skills) {
        profileFields.skills = skills.split(',').map(skill => skill.trim())
    }
    // Build social object
    profileFields.social = {}

    // assign field values
    if(youtube) profileFields.social.youtube = youtube
    if(facebook) profileFields.social.facebook = facebook
    if(twitter) profileFields.social.twitter = twitter
    if(instagram) profileFields.social.instagram = instagram
    if(linkedIn) profileFields.social.linkedIn = linkedIn

    try {
        // findOne profile and get the user
        let profile = await Profile.findOne({user: req.user.id})

        // If there is a profile, update it
        if (profile) {
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id }, 
                { $set: profileFields }, 
                { new: true }
            )
            return res.json(profile)
        }

        // create profile if not found
        profile = new Profile(profileFields)

        // Save the profile
        await profile.save()

        // return the profile
        return res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }
})


// @route       DELETE api/profile
// @desc        Delete profile user post
// @access      Private 
router.delete("/", auth, async (req, res) => {
    try {
        // TODO - remove user's post


        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id })

        // Remove user
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: "User deleted" })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }
})


// @route       PUT api/profile/experience
// @desc        Add profile experience
// @access      Private 

router.put("/experience", [auth, [
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
]], async (req, res) => {
    // validate the form fields for errors
    const errors = validationResult(req)
    // check if errors
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // Destructure the input values from the request body
    const { title, company, location, from, to, current, description } = req.body

    const newExp = {
        title, 
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        // create a new profile
        const profile = await Profile.findOne({ user: req.user.id })
        // add the most recent experience to the profile
        profile.experience.unshift(newExp) 

        // Save experience to the profile
        await profile.save()

        // return profile
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }

})

module.exports = router;