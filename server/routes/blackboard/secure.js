const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth')
const Hub = require('../../models/hub')
const Post = require('../../models/post')
const Comment = require('../../models/comment')

let images_folder = "./post-images/"

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
      let postId = req.files.postId
      console.log(postId)
      for (var pair of req.files.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
      delete req.files.postId
      Object.keys(req.files).forEach(filename => {
        let file = req.files[filename]
        //save image to images_folder
        file.mv(images_folder + file.name);
        // save image name to post
        const post = Post.findOne({ "_id": postId })
        post.images.push(filename)

        post.save()
      })
      res.send("Ok");
    }
  } catch (err) {
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
  const post = await Post.findOne({ "_id": req.body._id });
  post.text = req.body.text;
  post.title = req.body.title;
  await post.save();
  res.send("ok");
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
  await Post.deleteOne({ _id: postId })
  res.send("ok")
})


module.exports = router;