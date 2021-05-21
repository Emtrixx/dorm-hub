if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const Express = require('express')
const app = Express() 
const mongoose = require('mongoose')
var cors = require('cors')

app.use(cors())

const dbUrl = process.env.DB_URL || "mongodb://mongo:27017/dorm-hub"
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


app.get('/',(req,res) => {
    const data = [{
        title: 'Test',
        message: 'Erste message'
    }]
    res.send(JSON.stringify(data))
})

const port =  8081;
app.listen(port, () => {
    console.log('Server running: ' + port)
})