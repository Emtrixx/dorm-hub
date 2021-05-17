const mongoose = require("mongoose");
const Hub = require('../models/hub')
const User = require('../models/user')
const Comment = require('../models/comment')
const Post = require('../models/post')

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/dorm-hub"
mongoose.connect(dbUrl, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("Connected to mongodb");
    }).catch(() => {
        console.log("ERROR - Could not connect to mongodb");
    })

const seedDb = async () => {
    const admin = new User({
        _id: "60a2b8c22c6ab1289ce17436",
        email: 'admin@admin.com',
        username: 'admin',
        password: '123'
    })
    await admin.save()
    const comment = new Comment({
        _id: "60a2bbb836a8142d7848819e",
        text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        author: "60a2b8c22c6ab1289ce17436",
        date: new Date()
    })
    await comment.save()

    const post = new Post({
        _id: "60a2c1c16cdbc131f4c710dd",
        title: 'Test',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        author: "60a2b8c22c6ab1289ce17436",
        comments: ["60a2bbb836a8142d7848819e"]
    })
    await post.save()

    const foodsharing = new Hub({
        name: 'foodsharing',
        admins: ["60a2b8c22c6ab1289ce17436"],
        members: ["60a2b8c22c6ab1289ce17436"],
        posts: ["60a2c1c16cdbc131f4c710dd"]
    })
    await foodsharing.save()

}

seedDb().then( () => {
    mongoose.connection.close()
})