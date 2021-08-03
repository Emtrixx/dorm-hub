const express = require('express');
const router = express.Router();
const auth = require('../utils/auth')
const Hub = require('../models/hub')
const Post = require('../models/post')
const Comment = require('../models/comment')


//TODO: Put some in protected routes

//Test Route
router.get('/', (req, res) => {
    const data = [{
        title: 'Test',
        message: 'Erste message'
    }]
    res.send(JSON.stringify(data))
})

//Get all Hubs
router.get('/blackboard/all',async (req,res) => {
    const data = await Hub.find().populate('posts')
    res.send(JSON.stringify(data))
})

//Get all Posts
router.get('/blackboard/allPosts', async(req, res) => {
    const posts = await Post.find().populate('hub').populate('author')
    res.send(JSON.stringify(posts.reverse()))
})

//Get latest post
router.get('/blackboard/latestPost', async(req,res) => {
    const post = await Post.find({}).sort({_id: -1}).limit(1).populate('author').populate('hub')
    if (!post.length>0) {
        post[0] = {}
        res.status(404)
    }
    res.send(JSON.stringify(post[0]))
})

//Get Hub
router.get('/blackboard/:hub', async (req,res) => {
    const {hub} = req.params;
    const data = await Hub.findOne({name: hub}).populate('posts')
    res.send(JSON.stringify(data))
})

//Get Post
router.get('/blackboard/:hub/:postId', async (req,res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('author').populate({path: 'comments', populate: { path: 'author'}})
    res.send(JSON.stringify(post))
})


//Test route TODO remove
// router.post('/test', (req,res) => {
//     console.log(req.body)
//     res.send('success')
// })

//Register
router.post(
    '/register',
    // middleware that handles the registration process
    auth.register,
    // json handler
    auth.signJWTForUser,
    (req,res) => {
        console.log(req.body)
    }
)
  
// Sign in
router.post(
    '/login',
    // handles the sign in process
    auth.signIn,
    // json handler
    auth.signJWTForUser
)

module.exports = router;