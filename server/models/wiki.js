const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WikiArticleSchema = new Schema({
    text: String,
    textAsHtml: String,
    title: String
}, { timestamps: true })

const WikiCategorySchema = new Schema({
    articles: [{type: Schema.Types.ObjectId,ref: 'WikiArticle'}],
    name: String,
    modifiable: Boolean
}, { timestamps: true })


module.exports = {
    'WikiCategory': mongoose.model('WikiCategory', WikiCategorySchema),
    'WikiArticle': mongoose.model('WikiArticle', WikiArticleSchema)
}