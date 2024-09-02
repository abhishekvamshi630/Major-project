const User = require("../models/user");

//Render Signup page
module.exports.renderSingup = (req, res) => {
    res.render("./Authentication/signup.ejs");
};

//Post request for signup page
module.exports.signup = async (req, res) => {
    try{
        const {email, username} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, req.body.password);

        //Automatically login the user
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            req.flash("success",  "Welcome to Wandurlust");
            res.redirect("/listings");
        }) 
    }catch(e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

//Render login Page
module.exports.renderLogin = (req, res) => {
    res.render("./Authentication/login.ejs");
};

//Post request for login page
module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wandurlust :)")
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//Logout
module.exports.logout = (req, res, next) => {
    req.logout((err)  => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You logged out!")
        res.redirect("/listings");
    })
};