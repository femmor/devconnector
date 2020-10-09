const express = require("express");

const router = express.Router()
const auth = require("../../middleware/auth")

// Profile model
const Profile = require("../../models/Profile")
const User = require("../../models/User")

// Use request and config
const request = require("request")

const config = require("config")

// Validate user 
const { check, validationResult } = require("express-validator");

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


// @route       DELETE api/profile/experience/:exp_id
// @desc        Delete experience from profile
// @access      Private 

router.delete("/experience/:exp_id", auth, async(req, res) => {
    try {
        // Get the profile of the logged in user
        const profile = await Profile.findOne({user: req.user.id})

        // Get experience index - using Get removeIndex
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        // Splice out the index
        profile.experience.splice(removeIndex, 1)

        // Save it
        await profile.save()

        // return profile
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).json("Server error...")
    }
})

// @route       PUT api/profile/education
// @desc        Add profile education
// @access      Private 

router.put("/education", [auth, [
    check("school", "School is required").not().isEmpty(),
    check("degree", "Degree is required").not().isEmpty(),
    check("fieldOfStudy", "Field of study is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
]], async (req, res) => {
    // validate the form fields for errors
    const errors = validationResult(req)
    // check if errors
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    // Destructure the input values from the request body
    const { school, degree, fieldOfStudy, from, to, current, description } = req.body

    const newEdu = {
        school, 
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    }

    try {
        // create a new profile
        const profile = await Profile.findOne({ user: req.user.id })
        // add the most recent education to the profile
        profile.education.unshift(newEdu) 

        // Save education to the profile
        await profile.save()

        // return profile
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }

})


// @route       DELETE api/profile/education/:edu_id
// @desc        Delete education from profile
// @access      Private 

router.delete("/education/:edu_id", auth, async(req, res) => {
    try {
        // Get the profile of the logged in user
        const profile = await Profile.findOne({user: req.user.id})

        // Get education index - using Get removeIndex
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        // Splice out the index
        profile.education.splice(removeIndex, 1)

        // Save it
        await profile.save()

        // return profile
        res.json(profile)

    } catch (error) {
        console.error(error.message)
        res.status(500).json("Server error...")
    }
})


// @route       GET api/profile/github/:username
// @desc        Get user repos from github
// @access      Public
router.get("/github/:username", (req,res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubClientSecret')}`,
            method: "GET",
            headers: {'user-agent': 'node.js'}
        }

        request(options, (error, response, body) => {
            // Check for error and log it
            if(error) console.error(error)
            // Check if response code is not 200
            if(response.statusCode != 200) {
                return res.status(404).json({ msg: "No github profile found..." })
            }

            res.json(JSON.parse(body))
        })
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }
}) 


module.exports = router;