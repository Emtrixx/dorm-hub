const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth')

const News = require('../../models/news')
const Comment = require('../../models/comment')

// Mounted behind requireJWT in app.js. The 'news' role is applied per-route
// so plain logged-in users can still write comments.

function canModerate(user) {
    const roles = (user && user.roles) || []
    return roles.includes('news') || roles.includes('admin')
}

//Create news item
router.post('/', auth.requireRole('news'), async (req, res) => {
    const news = new News({
        title: req.body.title,
        content: req.body.content,
        author: req.user._id,
        comments: []
    })
    res.send(await news.save())
})

//Delete comment — its author or a news editor
//Fixed path: must stay above the /:newsId routes below
router.delete('/comments/:commentId', async (req, res) => {
    const comment = await Comment.findById(req.params.commentId)
    if (!comment) {
        return res.status(404).json({ message: 'Comment not found' })
    }
    const isAuthor = comment.author && comment.author.equals(req.user._id)
    if (!isAuthor && !canModerate(req.user)) {
        return res.status(403).json({ message: 'Not allowed to delete this comment' })
    }
    await News.updateOne({ comments: comment._id }, { $pull: { comments: comment._id } })
    await Comment.deleteOne({ _id: comment._id })
    res.send("Ok")
})

//Create comment on a news item — any logged-in user
router.post('/:newsId/comments', async (req, res) => {
    const news = await News.findById(req.params.newsId)
    if (!news) {
        return res.status(404).json({ message: 'News item not found' })
    }
    const comment = new Comment({ text: req.body.text, author: req.user._id })
    await comment.save()
    news.comments.unshift(comment._id)
    await news.save()
    res.send(comment)
})

//Update news item
router.post('/:newsId', auth.requireRole('news'), async (req, res) => {
    const news = await News.findById(req.params.newsId)
    if (!news) {
        return res.status(404).json({ message: 'News item not found' })
    }
    news.title = req.body.title
    news.content = req.body.content
    res.send(await news.save())
})

//Delete news item and its comments
router.delete('/:newsId', auth.requireRole('news'), async (req, res) => {
    const news = await News.findById(req.params.newsId)
    if (!news) {
        return res.status(404).json({ message: 'News item not found' })
    }
    await Comment.deleteMany({ _id: { $in: news.comments } })
    await News.deleteOne({ _id: news._id })
    res.send("Ok")
})

module.exports = router;
