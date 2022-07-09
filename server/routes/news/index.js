const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth')

const News = require('../../models/news')

router.get('/all', async (_,res) => {
    console.log("getting all news")
    const newsList = await News.find().populate('author')
    console.log("get all news")
    res.send(JSON.stringify(newsList.reverse()))
}) 
router.get('/:newsId', async (req,res)=> {
    const { newsId } = req.params
    const newsItem = await News.findById(newsId).populate('author').populate({path: 'comments', populate: { path: 'author'}})
    console.log(newsItem)
    
    res.send(JSON.stringify(newsItem))
})

module.exports = router;