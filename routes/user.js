const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utility/wrapAsync");
const passport = require("passport");
const {savedRedirectUrl} =  require("../views/checkLoginMiddleware");
//require user controller
const userController = require("../controllers/user.js");

router.route("/signup")
    //render signup page
    .get(userController.renderSingup)
    //post Request
    .post(wrapAsync(userController.signup))

router.route("/login")
    //authentication for Login Page
    .get(userController.renderLogin)
    //Post Request   
    .post(savedRedirectUrl, passport.authenticate('local', { failureRedirect: '/login', failureFlash : true}), userController.login)

//Logout
router.get("/logout", userController.logout);

module.exports = router;