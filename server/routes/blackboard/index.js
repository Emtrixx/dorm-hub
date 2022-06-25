const express = require('express');
const router = express.Router();
const Hub = require('../../models/hub')
const Post = require('../../models/post')
const Comment = require('../../models/comment')
const path = require('path')

let images_folder = "/post-images/"
//Get all Hubs
router.get('/all', async (req, res) => {
    const data = await Hub.find().populate('posts')
    res.send(JSON.stringify(data))
})

//Get all Posts
router.get('/allPosts', async (req, res) => {
    const posts = await Post.find().populate('hub').populate('author')
    res.send(JSON.stringify(posts.reverse()))
})

//Get latest post
router.get('/latestPost', async (req, res) => {
    const post = await Post.find({}).sort({ _id: -1 }).limit(1).populate('author').populate('hub')
    if (!post.length > 0) {
        post[0] = {}
        res.status(404)
    }
    res.send(JSON.stringify(post[0]))
})

//get post image
router.get('/post-images/:filename', async (req, res) => {
    let filename = req.params.filename;
    console.log(__dirname)
    res.sendFile(path.join(__dirname, "../../post-images/" + filename))
})

//Get Hub
router.get('/:hub', async (req, res) => {
    const { hub } = req.params;
    const data = await Hub.findOne({ name: hub }).populate('posts')
    res.send(JSON.stringify(data))
})

//Get Post
router.get('/:hub/:postId', async (req, res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('author').populate({ path: 'comments', populate: { path: 'author' } })
    res.send(JSON.stringify(post))
})


module.exports = router;