const express = require('express');
const router = express.Router();
const Wiki = require('../../models/wiki')
var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();


router.get('/all', async (req, res) => {
    const categoriesList = await Wiki.WikiCategory.find().populate('articles')
        .populate({ path: "articles", populate: {
            path: "author",
            model: "User"
        } });
    res.send(JSON.stringify(categoriesList))
})


router.get('/getArticle', async (req, res) => {
    let articleId = req.query.id;
    console.log("articleId: " + articleId);
    let article = await Wiki.WikiArticle.find({ "_id": articleId }).populate("author");
    res.send(JSON.stringify(article));
})

module.exports = router;