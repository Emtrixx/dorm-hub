const express = require('express');
const router = express.Router();
const Wiki = require('../../models/wiki')

router.get('/all', async (req, res) => {
    const categoriesList = await Wiki.WikiCategory.find().populate('articles');
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
    console.log("deleting" + body.name)
    await Wiki.WikiCategory.deleteOne({ "name": body.name });
    res.send("It worked!");
})


router.post('/addArticleToCategory', async (req, res) => {
    let body = req.body;
    let newArticle = body.article;
   
    if (typeof newArticle._id !== "undefined") {
        let articleJson = await Wiki.WikiArticle.findOne({ "_id": newArticle._id });
        articleJson.title = newArticle.title;
        articleJson.text = newArticle.text;
        await articleJson.save();
    }
    else {
        let categoryJson = await Wiki.WikiCategory.findOne({ "_id": body.category }).populate('articles');
        let newArticleJson = await Wiki.WikiArticle({ "title": newArticle.title, "text": newArticle.text })
        await newArticleJson.save();
        categoryJson.articles.push(newArticleJson._id);
        await categoryJson.save();
    }

    res.send("It worked!");
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