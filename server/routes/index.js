const express = require('express');
const router = express.Router();
const auth = require('../utils/auth')
const Hub = require('../models/hub')
const Post = require('../models/post')
const Comment = require('../models/comment')

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
    res.send(data)
})

//Get all Posts
router.get('/blackboard/allPosts', async(req, res) => {
    const posts = await Post.find().populate('hub').populate('author')
    res.send(posts)
})

//Get latest post
router.get('/blackboard/latestPost', async(req,res) => {
    const post = await Post.find({}).sort({_id: -1}).limit(1).populate('author').populate('hub')
    console.log(post)
    res.send(post[0])
})

//Get Hub
router.get('/blackboard/:hub', async (req,res) => {
    const {hub} = req.params;
    const data = await Hub.findOne({name: hub}).populate('posts')
    res.send(data)
})


//TODO: Put in protected routes


//Get Post
router.get('/blackboard/:hub/:postId', async (req,res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('author').populate({path: 'comments', populate: { path: 'author'}})
    res.send(post)
})


//Delete Post
router.delete('/blackboard/:hub/:postId', async (req,res) => {
    const { postId } = req.params;
    // await 
    res.send(result)
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