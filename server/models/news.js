const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
    contentType: {
        type: String,
        enum: ['img', 'text']
    },
    content: String
  });

const NewsSchema = new Schema({
    title: String,
    content: [ContentSchema],
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }]
}, {timestamps: true})

module.exports = mongoose.model('News', NewsSchema)