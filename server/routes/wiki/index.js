const express = require('express');
const router = express.Router();
const Wiki = require('../../models/wiki')
const mongoose = require('mongoose')
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


router.post('/addCategory', async (req, res) => {
    let body = req.body;
    const thisCategory = await Wiki.WikiCategory.find({ 'name': body.name });
    if (thisCategory.length == 0) {
        const wikiCategory = new Wiki.WikiCategory({
            name: body.name,
            modifiable: true,
            articles: [
            ],
        })
        console.log("saving wiki entry of name " + body.name);
        await wikiCategory.save()
    }
    res.send("It worked!");
})

router.post('/removeCategory', async (req, res) => {
    let body = req.body;
    await Wiki.WikiCategory.deleteOne({ "name": body.name });
    res.send("It worked!");
})

router.post('/renameCategory', async (req, res) => {
    let categoryId = req.body.categoryId;
    let newName = req.body.newName;
    let categoryJson = await Wiki.WikiCategory.findOne({ "_id": categoryId });
    categoryJson["name"] = newName;
    await categoryJson.save();
    res.end();
})



router.get('/getArticle', async (req, res) => {
    let articleId = req.query.id;
    console.log("articleId: " + articleId);
    let article = await Wiki.WikiArticle.find({ "_id": mongoose.Types.ObjectId(articleId) }).populate("author");
    res.send(JSON.stringify(article));
})

router.post('/removeArticle', async (req, res) => {
    let articleId = req.body.articleId;
    await Wiki.WikiArticle.deleteOne({ "_id": articleId });
    let category = await Wiki.WikiCategory.findOne({ articles: { _id: articleId } });
    category.articles = category.articles.filter(item => item._id !== articleId);
    category.save();
    res.send("It worked!");
})



module.exports = router;