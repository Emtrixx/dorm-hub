if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const auth = require('./utils/auth')

//enables cross origin resources
app.use(cors())
//makes json and urlencoded response data usable
app.use(express.json())
app.use(express.urlencoded({extended: true}))


//mongoose connects to mongoDB
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/dorm-hub"
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
    .then(() => {
        console.log("Connected to mongodb");
        console.log(dbUrl);
    }).catch(() => {
        console.log("ERROR - Could not connect to mongodb");
    })


// Routes files
const generalRoutes = require('./routes/general/index')

const authRoutes = require('./routes/auth')

const blackboardRoutes = require('./routes/blackboard/index')
const blackboardSecureRoutes = require('./routes/blackboard/secure');

const newsRoutes = require('./routes/news/index')
const newsSecureRoutes = require('./routes/news/secure');

const wikiRoutes = require('./routes/wiki/index')

// Routing
// Secure routes use auth middleware before routing
app.use('/', generalRoutes)

app.use('/auth', authRoutes)

app.use('/blackboard-secure', auth.requireJWT, blackboardSecureRoutes)
app.use('/blackboard', blackboardRoutes)


app.use('/news', newsRoutes)
app.use('/news', auth.requireJWT, newsSecureRoutes)

app.use('/wiki', wikiRoutes)


//error handler. Sends error as json
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

//Server start on port xxxx
const port = 8081;
app.listen(port, () => {
    console.log('Server running: ' + port)
})