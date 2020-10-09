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

router.get("/", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })
        res.json(posts)
    } catch (error) {
        console.error(error)
        res.status(500).send("Server error...")
    }
})


// @route       Get api/posts/:id
// @desc        Get user posts by ID
// @access      Private

router.get("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // Check if there is a post with that ID
        if (!post) {
            return res.status(404).json({ msg: "Post not found..." })
        }

        res.json(post)
    } catch (error) {
        console.error(error)
        // If not a formatted ObjectID
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found..." })
        }
        res.status(500).send("Server error...")
    }
})


// @route       Delete api/posts/:id
// @desc        Delete a post
// @access      Private
router.delete("/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        // If not a formatted ObjectID
        if (!post) {
            return res.status(404).json({ msg: "Post not found..." })
        }

        // Check to see if the user is the owner of the post
        // post.user is not a String // convert toString() 
        // req.user.id is a String
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({ msg: "User not authorized..." })
        }

        // remove post
        await post.remove()

        // send success message
        res.json({ msg: "Post removed successfully..." })
    } catch (error) {
        console.error(error.message)
        // If not a formatted ObjectID
        if (error.kind === "ObjectId") {
            return res.status(404).json({ msg: "Post not found..." })
        }
        res.status(500).send("Server error...")
    }
})


// @route       PUT api/posts/like/:id
// @desc        Like a post
// @access      Private

router.put("/like/:id", auth, async(req, res)=> {
    try {
        // fetch the post
        const post = await Post.findById(req.params.id)
        // Check if the post has already been liked by the user
        // filter the liked post

        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ nsg: "Post already liked..." })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()

        res.json(post.likes)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }
})

// @route       PUT api/posts/unlike/:id
// @desc        Unlike a post
// @access      Private
router.put("/unlike/:id", auth, async(req, res)=> {
    try {
        // fetch the post
        const post = await Post.findById(req.params.id)
        // Check if the post has not been liked by the user
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ nsg: "Post has not yet been liked..." })
        }

        // Get remove index
        const removeIndex = post.likes.map(like => like.user.toString().indexOf(req.user.id))

        post.likes.splice(removeIndex, 1)

        await post.save()

        res.json(post.likes)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }
})


// @route       COMMENT api/posts/comment/:id
// @desc        Comment on a post
// @access      Private - You have to be logged in to create a comment
router.post("/comment/:id", [auth, [
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
        // Get the post
        const post = await Post.findById(req.params.id)

        // Setup new post object
        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar, 
            user: req.user.id
        }

        post.comments.unshift(newComment)

        // Save post
        await post.save()

        // Send the post response
        res.json(post.comments)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }

})


// @route       DELETE Comment api/posts/comment/:id/:comment_id
// @desc        Delete comment on a post
// @access      Private - You have to be logged in to delete a comment
router.delete("/comment/:id/:comment_id", auth, async (req, res) => {
    try {
        // Get the post
        const post = await Post.findById(req.params.id)
        // Pull out comment from the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)
        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: "Comment does not exist..." })
        }

        // Check id user is the owner of comment
        if(comment.user.toString() !== req.user .id){
            return res.status(401).json({ msg: "User not authorized..." })
        }
        
        // Get remove index
        const removeIndex = post.comments.map(comment => comment.user.toString().indexOf(req.user.id))

        post.comments.splice(removeIndex, 1)

        await post.save()

        res.json(post.comments)

    } catch (error) {
        console.error(error.message)
        res.status(500).send("Server error...")
    }
})

module.exports = router;