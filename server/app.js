if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')
const passport = require('passport')
const auth = require('./utils/auth')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))


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


const routes = require('./routes/index')
const secureRoutes = require('./routes/secure');

app.use('/', routes)

app.use('/user', auth.requireJWT, secureRoutes)

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({ error: err });
});

const port = 8081;
app.listen(port, () => {
    console.log('Server running: ' + port)
})