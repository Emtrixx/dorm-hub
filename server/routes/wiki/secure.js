const express = require('express');
const router = express.Router();
const Wiki = require('../../models/wiki')
var MarkdownIt = require('markdown-it'),
md = new MarkdownIt();

// All routes here are mounted behind requireJWT + requireRole('wiki') in app.js

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

router.post('/removeArticle', async (req, res) => {
    let articleId = req.body.articleId;
    await Wiki.WikiArticle.deleteOne({ "_id": articleId });
    let category = await Wiki.WikiCategory.findOne({ articles: articleId });
    category.articles = category.articles.filter(item => item.toString() !== articleId);
    await category.save();
    res.send("It worked!");
})

router.post('/setArticleToCategory', async (req, res) => {
    let body = req.body;
    let newArticle = body.article;
    newArticle.textAsHtml = md.render(newArticle.text).toString();
    if (typeof newArticle._id !== "undefined") {
        let articleJson = await Wiki.WikiArticle.findOne({ "_id": newArticle._id });
        articleJson.title = newArticle.title;
        articleJson.text = newArticle.text;
        articleJson.textAsHtml = newArticle.textAsHtml;
        // author stays as-is: any wiki editor may update any article
        await articleJson.save();
        res.set('Content-Type', 'application/json')
        res.end("{}");
    }
    else {
        let categoryJson = await Wiki.WikiCategory.findOne({ "_id": body.category }).populate('articles');
        let newArticleJson = new Wiki.WikiArticle({ "author": req.user._id, "title": newArticle.title, "text": newArticle.text, "textAsHtml": newArticle.textAsHtml })
        await newArticleJson.save();
        categoryJson.articles.push(newArticleJson._id);
        await categoryJson.save();
        res.send("hallo");
    }
})


module.exports = router;