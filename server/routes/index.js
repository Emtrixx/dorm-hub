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

router.get('/blackboard/all',async (req,res) => {
    const data = await Hub.find().populate('posts')
    res.send(data)
})

router.get('/blackboard/:hub', async (req,res) => {
    const {hub} = req.params;
    const data = await Hub.findOne({name: hub}).populate('posts')
    res.send(data)
})

//TODO: Put in protected routes
router.post('/blackboard/:hub', async (req,res) => {
    const {hub} = req.params;
    console.log(req.body)
    const newPost = new Post(req.body)
    const result = await newPost.save()
    const selectedHub = await Hub.findOne({name: hub}) 
    selectedHub.posts.push(newPost)
    await selectedHub.save()
    console.log(result)
    res.send(result)
})

router.get('/blackboard/:hub/:postId', async (req,res) => {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('author').populate('comments')
    res.send(post)
})

router.delete('/blackboard/:hub/:postId', async (req,res) => {
    const { postId } = req.params;
    // await 
    res.send(result)
})

router.post('/test', (req,res) => {
    console.log(req.body)
    res.send('success')
})

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