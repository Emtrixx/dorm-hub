const express = require('express');
const router = express.Router();
const auth = require('../utils/auth')
const Hub = require('../models/hub')
const Post = require('../models/post')
const Comment = require('../models/comment')

router.get(
  '/profile',
  (req, res) => {
    res.json({
      message: 'You made it to the secure route',
      user: req.user,
      token: req.query.secret_token
    })
  }
);

//Create Comment
router.post('/blackboard/:hub/:postId', async (req, res) => {
  const { postId } = req.params
  const post = await Post.findById(postId)
  const comment = new Comment(req.body)
  post.comments.push(comment)
  await post.save()
  console.log(comment)
  const data = await comment.save()
  res.send(data)
})


//Create Post
router.post('/blackboard/:hub', async (req,res) => {
  const {hub} = req.params;
  console.log(req.body)
  const newPost = new Post(req.body)
  const selectedHub = await Hub.findOne({name: hub})
  newPost.hub = selectedHub 
  const result = await newPost.save()
  selectedHub.posts.push(newPost)
  await selectedHub.save()
  console.log(result)
  res.send(result)
})



module.exports = router;