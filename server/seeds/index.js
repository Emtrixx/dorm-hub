const mongoose = require("mongoose");
//Blackboard
const Hub = require('../models/hub')
const User = require('../models/user')
const Comment = require('../models/comment')
const Post = require('../models/post');
const Wiki = require('../models/wiki')
//News
const News = require('../models/news');
const { WikiArticle } = require("../models/wiki");

var MarkdownIt = require('markdown-it'),
    md = new MarkdownIt();


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
    await User.deleteMany({})
    let user = new User({
        _id: "60ac03c53a2b3c16c02c6d44",
        email: 'test@test.de',
        firstName: "Test",
        lastName: "User",
        salt: "171e32182ad1c29b65602df91c4c153610e46d12e731df882cb11d389a36a74e",
        hash: "c081cdfb998fa3672d552e9ce48573dc569c12524dc219a05296235f89e317b9fc16e0fbf062c5d486a0f87d00d43522b6231bb7f60d458f0b02fe25625371f2785c68ffafe55e4ded4e06fc012a70644df7497a5d015a5047177443b71174c571af7e1bb9e76d1e8d5e0b47c880feafde4bf72f69dabe326c74c256a7375d2ef1bbf38d7e9ed8138c445bcc0facfd059841056281a9e580468189512dc019c2f323ac922687c64c898aeffee968c524aef1629109394717e4067d4daa152e20e6b2c5f1bc36da13c43791c50fad95b8ea11c917a6e0552a4992b2d8d0433c36c5327215754396da0b85d097a3816dc036eb33860e13299e18a30b96af033d5362f23989c165cae23749b0181352c6905c9272ad11052e84bedade256664f34136fcfbfa8025765a5137c218683cb2188444baf33abee1e4fa7bb8eb922abab3a831087d67c05b00d9c1a5cdc0a9e4c9849fbd79d125d48a966a081977805535abfcb8abc7d892b37094eca7e4f34f2b594e7ca2add2956195108672bd1db53c8bb74ac2663939c3b4a982947aec8668161477ffdbe13ed198cfc2cc86bae5462edf042e2787680843554cc078d18a6044526d102656fbecd5e08b4f0364e1c723b0452d2bd65caa88db66076c9698a9036312f5883cdb2b67c7cbee7d71032347934a41bc3ac3fc468c49144669a9cb1c50e9683bc846a7caebc29bcba40bb2",
    })
    await user.save()

    //Instead of seeding first user you can just register on the site first before seeding the rest
    user = await User.findOne({});




    //Blackboard
    //DELETE OLD
    await Comment.deleteMany({})
    await Post.deleteMany({})
    await Hub.deleteMany({})

    const comment = new Comment({
        _id: "60a2bbb836a8142d7848819e",
        text: 'At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        author: user.id,
        date: new Date()
    })
    await comment.save()

    const post = new Post({
        _id: "60a2c1c16cdbc131f4c710dd",
        title: 'Test',
        text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        author: user.id,
        comments: ["60a2bbb836a8142d7848819e"],
        hub: "60fdecbe15bb274108b4ef9b"
    })
    await post.save()

    const foodsharing = new Hub({
        _id: "60fdecbe15bb274108b4ef9b",
        name: 'foodsharing',
        admins: [user.id],
        members: [user.id],
        posts: ["60a2c1c16cdbc131f4c710dd"]
    })
    await foodsharing.save()

    const general = new Hub({
        name: 'general',
        admins: [user.id],
        members: [user.id],
        posts: []
    })
    await general.save()

    const heimrat = new Hub({
        name: 'heimrat',
        admins: [user.id],
        members: [user.id],
        posts: []
    })
    await heimrat.save()


    //News
    //DELETE OLD
    await News.deleteMany({})

    const news = new News({
        title: 'Superspannende Nachricht',
        content: [{
            contentType: 'text',
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        },
        {
            contentType: 'text',
            content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
        }
        ],
        author: user.id,
        comments: ["60a2bbb836a8142d7848819e"],
    })
    await news.save()

    await Wiki.WikiArticle.deleteMany({})
    await Wiki.WikiCategory.deleteMany({})

    let text = "### Die Turnier AG spielt gerne turniere";
    const wikiArticle1 = new Wiki.WikiArticle({
        title: "Turnier AG", text: text,
        textAsHtml: md.render(text)
    });
    text = "Die Schlefaz AG guckt Filme.";
    const wikiArticle2 = new Wiki.WikiArticle({ title: "Schlefaz AG", text: text, textAsHtml: md.render(text) });
    await wikiArticle1.save();
    await wikiArticle2.save();
    const wikiCategory = new Wiki.WikiCategory({
        name: "AGs",
        modifiable: true,
        articles: [wikiArticle1._id, wikiArticle2._id
        ],
    })
    await wikiCategory.save()

}

seedDb().then(() => {
    mongoose.connection.close()
})