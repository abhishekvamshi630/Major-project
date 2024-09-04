const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");
const engine = require('ejs-mate');
const { render } = require("ejs");
const db_Url = "mongodb://127.0.0.1:27017/wandurlust";
const ExpressError = require("./utility/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");

// for Authentication
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//routes paths
const listings = require("./routes/routeListings.js");
const reviews = require("./routes/review.js");
const usersRoute = require("./routes/user.js");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

//Cloud Api Key
const apiKey = process.env.CLOUD_API_KEY;

//Atlas Data Base Url
const  dbUrl = process.env.ATLASDB_URL;

Main().then(() => {
    console.log("Connected to DataBase");
}).catch((err) => {
    console.log(err);
})

async function Main() {
    await mongoose.connect(dbUrl);
}

//Mongoose Store to store  session data in MongoDb Atlas
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
      secret: process.env.SECRET_KEY,
    },
    touchAfter : 24 * 3600,
})

store.on('error', () => {
    console.log('session store error', err);
})

// Session use
const sessionOption = {
    store,
    secret : process.env.SECRET_KEY,
    resave : false,
    saveUninitialized : true,
    cookie: {
        expires : Date.now() + 7 *  24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true
    }
}

app.use(flash())
app.use(session(sessionOption));

//Use of  Passport Authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//creating flash middleware
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.user = req.user;
    next();
})

// creating a demo user for authentication
app.get("/demouser", async (req, res) => {
    let fakeUser =  new User({
        username : "Abhishek",
        email : "abhishek@gmail.com",
    })

    let registeredUser = await User.register(fakeUser,  "password123" );
    res.send(registeredUser);
})

// use of Route Listings
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", usersRoute);

// for all requests
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
})

//custom err Handler
app.use((err, req, res, next) => {
    let {status = 500, message = "Something went wrong"} = err;
    res.status(status).render("error.ejs", {message});
})

app.listen(8080, () => {
    console.log("Port is Listening to 8080")
})