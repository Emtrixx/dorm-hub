const express = require('express');
const router = express.Router();

const News = require('../../models/news')

// All routes here are mounted behind requireJWT + requireRole('news') in app.js

//Create news item
router.post('/', async (req, res) => {
    const news = new News({
        title: req.body.title,
        content: req.body.content,
        author: req.user._id,
        comments: []
    })
    res.send(await news.save())
})

//Update news item
router.post('/:newsId', async (req, res) => {
    const news = await News.findById(req.params.newsId)
    if (!news) {
        return res.status(404).json({ message: 'News item not found' })
    }
    news.title = req.body.title
    news.content = req.body.content
    res.send(await news.save())
})

//Delete news item
router.delete('/:newsId', async (req, res) => {
    await News.deleteOne({ _id: req.params.newsId })
    res.send("Ok")
})

module.exports = router;
