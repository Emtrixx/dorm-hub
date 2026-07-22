if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const auth = require('./utils/auth')
const fileUpload = require('express-fileupload');

app.use(express.static('post-images'));
// enable files upload
app.use(fileUpload({
    createParentPath: true
}));
//enables cross origin resources
app.use(cors())
//makes json and urlencoded response data usable
app.use(express.json())
app.use(express.urlencoded({extended: true}))


// Routes files
const generalRoutes = require('./routes/general/index')

const authRoutes = require('./routes/auth')

const blackboardRoutes = require('./routes/blackboard/index')
const blackboardSecureRoutes = require('./routes/blackboard/secure');

const newsRoutes = require('./routes/news/index')
const newsSecureRoutes = require('./routes/news/secure');

const wikiRoutes = require('./routes/wiki/index')
const wikiSecureRoutes = require('./routes/wiki/secure')

// Routing
// Each domain mounts its JWT-protected router on /<domain>/secure and its
// public router on /<domain>. Secure routers must be mounted first: the public
// blackboard router has a catch-all /:hub route that would otherwise swallow
// /secure/... paths.
app.use('/', generalRoutes)

app.use('/auth', authRoutes)

app.use('/blackboard/secure', auth.requireJWT, blackboardSecureRoutes)
app.use('/blackboard', blackboardRoutes)

// News applies requireRole('news') per-route so logged-in users can comment
app.use('/news/secure', auth.requireJWT, newsSecureRoutes)
app.use('/news', newsRoutes)

app.use('/wiki/secure', auth.requireJWT, auth.requireRole('wiki'), wikiSecureRoutes)
app.use('/wiki', wikiRoutes)

//error handler. Sends error as json
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

module.exports = app

// Only connect and listen when run directly (tests import the app instead)
if (require.main === module) {
    const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/dorm-hub"
    mongoose.connect(dbUrl)
        .then(() => {
            console.log("Connected to mongodb");
            console.log(dbUrl);
        }).catch(() => {
            console.log("ERROR - Could not connect to mongodb");
        })

    const port = process.env.PORT || 8081;
    app.listen(port, () => {
        console.log('Server running: ' + port)
    })
}
