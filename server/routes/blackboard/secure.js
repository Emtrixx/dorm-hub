const express = require('express');
const router = express.Router();
const Hub = require('../../models/hub')
const Post = require('../../models/post')
const Comment = require('../../models/comment')
const auth = require('../../utils/auth')
const sharp = require('sharp');
const fs = require("fs")
const { randomUUID } = require('node:crypto');
let images_folder = "./post-images/"

// Hub management needs the 'hubs' role on top of a valid JWT.
// These fixed paths must stay above the /:hub catch-alls below.
router.post('/hubs', auth.requireRole('hubs'), async (req, res) => {
  const name = (req.body.name || '').trim()
  if (!name) {
    return res.status(400).json({ message: 'Hub name is required' })
  }
  const existing = await Hub.findOne({ name })
  if (existing) {
    return res.status(409).json({ message: `Hub "${name}" already exists` })
  }
  const hub = new Hub({
    name,
    admins: [req.user._id],
    members: [req.user._id],
    posts: []
  })
  res.send(await hub.save())
})

router.delete('/hubs/:name', auth.requireRole('hubs'), async (req, res) => {
  const hub = await Hub.findOne({ name: req.params.name })
  if (!hub) {
    return res.status(404).json({ message: 'Hub not found' })
  }
  const posts = await Post.find({ hub: hub._id })
  for (const post of posts) {
    for (const image_filename of post.images) {
      fs.unlink(images_folder + image_filename, () => {})
    }
  }
  await Post.deleteMany({ hub: hub._id })
  await Hub.deleteOne({ _id: hub._id })
  res.send("Ok")
})

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

router.post('/upload-images', async (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded'
      });
    } else {
      let postId = req.body.postId
      const post = await Post.findOne({ "_id": postId })
      await Object.keys(req.files).forEach((filename) => {
        let file = req.files[filename]
        let unique_filename = randomUUID()
        //save image to images_folder
        //file.mv(images_folder + file.name);
        sharp(file.data)
          .resize(300)
          //format to jpg
          .toFile(images_folder + unique_filename + ".jpg")
          .catch((err) => {
            console.log("error resizing image");
            console.log(err)
          });
        // save image name to post
        post.images.unshift(unique_filename + ".jpg")
      })
      await post.save()
      res.send("Ok");
    }
  } catch (err) {
    console.log(err)
    console.log("error")
    res.status(500).send(err);
  }
});

//Create Comment
router.post('/:hub/:postId', async (req, res) => {
  const { postId } = req.params
  const post = await Post.findById(postId)
  const comment = new Comment(req.body)
  post.comments.unshift(comment)
  await post.save()
  const data = await comment.save()
  res.send(data)
})

router.post('/setPost', async (req, res) => {
  console.log(req.body._id)
  const post = await Post.findOne({ "_id": req.body._id });
  post.text = req.body.text;
  post.title = req.body.title;
  post.author = req.body.author;
  let result = await post.save();
  res.send(result);
})

//get id of new, empty post
router.get('/new-post-id/:hub', async (req, res) => {
  console.log("path new post id ")
  const { hub } = req.params;
  const newPost = new Post({ title: ' ', text: ' ' })
  const selectedHub = await Hub.findOne({ name: hub })
  newPost.hub = selectedHub._id
  console.log("save post")
  let result = await newPost.save()
  selectedHub.posts.unshift(result._id)
  await selectedHub.save()
  res.send(JSON.stringify(result._id.toString()))
})

//Create Post
router.post('/:hub', async (req, res) => {
  const { hub } = req.params;
  const newPost = new Post(req.body)
  const selectedHub = await Hub.findOne({ name: hub })
  newPost.hub = selectedHub._id
  let result = await newPost.save()
  selectedHub.posts.unshift(newPost._id)
  await selectedHub.save()
  res.send(result)
})

//Get users Posts
router.get('/myPosts', async (req, res) => {
  //TODO
  const posts = await Post.find().where("author").equals(req.user).populate('hub').populate('author')
  res.send(JSON.stringify(posts.reverse()))
})

//Delete Post TODO: NOT FINISHED
router.delete('/:hub/:postId', async (req, res) => {
  const postId = req.params.postId;
  const hub = req.params.hub;
  await Hub.updateOne({ name: hub }, {
    $pullAll: {
      posts: [{ _id: postId }]
    }
  })
  let post = await Post.findOne({ _id: postId })
  for (let i = 0; i < post.images.length; i++) {
    let image_filename = post.images[i]
    fs.unlink(images_folder + image_filename, (err) => {
      if (err) throw err;
      console.log('path/file.txt was deleted');
    })
  }
  await Post.deleteOne({ _id: postId })
  res.send("ok")
})


module.exports = router;