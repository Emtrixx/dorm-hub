const express = require('express');
const router = express.Router();
const auth = require('../../utils/auth')

router.post('/setArticleToCategory', async (req, res) => {
    let body = req.body;
    let newArticle = body.article;
    newArticle.textAsHtml = md.render(newArticle.text).toString();
    if (typeof newArticle._id !== "undefined") {
        let articleJson = await Wiki.WikiArticle.findOne({ "_id": mongoose.Types.ObjectId(newArticle._id) });
        articleJson.title = newArticle.title;
        articleJson.text = newArticle.text;
        articleJson.textAsHtml = newArticle.textAsHtml;
        //articleJson.author = req.user._id;
        await articleJson.save();
        res.set('Content-Type', 'application/json')
        res.end("{}");
    }
    else {
        let categoryJson = await Wiki.WikiCategory.findOne({ "_id": body.category }).populate('articles');
        console.log("user id: " + req.user._id)
        let newArticleJson = await Wiki.WikiArticle({ "author": req.user._id, "title": newArticle.title, "text": newArticle.text, "textAsHtml": newArticle.textAsHtml })
        await newArticleJson.save();
        categoryJson.articles.push(newArticleJson._id);
        await categoryJson.save();
        res.send("hallo");
    }
})


module.exports = router;