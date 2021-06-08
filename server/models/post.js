const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment"
    }],
    date: {
        type: Date,
    }
})

module.exports = mongoose.model('Post', PostSchema)