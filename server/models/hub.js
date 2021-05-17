const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HubSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    members: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],
    posts: [{
        type: Schema.Types.ObjectId,
        ref: "Post"
    }]
})

module.exports = mongoose.model('Hub', HubSchema);