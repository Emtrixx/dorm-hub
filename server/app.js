if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const Express = require('express')
const app = Express() 
const mongoose = require('mongoose')


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


const port =  3000;
app.listen(port, () => {
    console.log('Server running: ' + port)
})