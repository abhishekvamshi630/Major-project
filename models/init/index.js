const mongoose = require("mongoose");
const Listing = require("../listing.js");
const listData = require("./data.js");
const db_Url = "mongodb://127.0.0.1:27017/wandurlust";

Main().then(() => {
    console.log("Connected to DataBase");
}).catch((err) => {
    console.log(err);
})

async function Main() {
    await mongoose.connect(db_Url);
}

const initDb = async () => {
    await Listing.deleteMany({});
    listData.data = listData.data.map((obj) => ({...obj, owner : '66c9f3f20ea0c186f551bb53'}));
    await Listing.insertMany(listData.data);
    console.log("Data was Initialized");
}

initDb();




