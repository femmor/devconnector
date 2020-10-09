const express = require("express");

const router = express.Router()

const {check, validationResult} = require("express-validator")

const auth = require("../../middleware/auth")

// Bring in all models
const User = require("../../models/User")
const Post = require("../../models/Post")
const Profile = require("../../models/Profile")

// @route       POST api/posts
// @desc        Create a post
// @access      Private - You have to be logged in to create a post
router.post("/",[auth, [
    check("text", "Text is required").not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        // Don't want to send the password back, just the user's ID - (use select("-password"))
        const user = await User.findById(req.user.id).select('-password')

        // Setup new post object
        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar, 
            user: req.user.id
        })

        // Save post
        const post = await newPost.save()

        // Send the post response
        res.json(post)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }

})


// @route       Get api/posts
// @desc        Get all posts
// @access      Private

router.get("/", [auth], async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error...")
    }
})

module.exports = router;