const express = require('express')
const path = require('path')
const mongoose = require('mongoose');
const { Schema } = mongoose;
const ejs = require("ejs")
const bodyParser = require('body-parser')
// const fetch = require("node-fetch")
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));



const app = express()
const port = 3002

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// app.use(express.static("public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json())

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/Quadb-tech', () => {
        console.log("Connected to database successfully")
    });
}

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true,
        unique: true
    },
    buy: {
        type: String,
        required: true
    },
    sell: {
        type: String,
        required: true
    },
    volume: {
        type: String,
        required: true
    }
});
const User = mongoose.model('user', UserSchema);

app.get("/", async (req, res) => {

    url = "https://api.wazirx.com/api/v2/tickers"

    const response = await fetch(url);
    const data = await response.json();
    let mydata = Object.entries(data).slice(0, 10).map(e => e[1]);

    mydata.map((data) => {
        const data1 = new User({

            name: data.name,
            last: data.last,
            sell: data.sell,
            buy: data.buy,
            volume: data.volume

        })
        data1.save()
    })
    const result = await User.find({})
    res.render("landing", {mydata: result})
    
});




app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})