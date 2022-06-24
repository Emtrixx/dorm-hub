const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth')

const News = require('../../models/news')

router.get('/all', async (req, res) => {
    console.log("getting all news")
    const newsList = await News.find().populate('author')
    console.log("get all news")
    res.send(JSON.stringify(newsList.reverse()))
})



router.post('/', (req, res) => {

})

router.get('/latest', async (req, res) => {
    const newsList = await News.find({
        updatedAt: {
            $gte: new Date(new Date() - 7 * 60 * 60 * 24 * 1000)
        }
    }).populate('author').limit(5)

    res.send(JSON.stringify(newsList.reverse()))
})

router.get('/:newsId', async (req, res) => {
    const { newsId } = req.params
    const newsItem = await News.findById(newsId).populate('author').populate({ path: 'comments', populate: { path: 'author' } })
    console.log(newsItem)

    res.send(JSON.stringify(newsItem))
})

module.exports = router;