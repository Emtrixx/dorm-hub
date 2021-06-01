const express = require('express');
const router = express.Router();

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

router.post('/blackboard/:hub', async (req, res) => {
  const {post} = new Post(req.body.post)
  const data = await post.save()
  res.send(data)
})

module.exports = router;