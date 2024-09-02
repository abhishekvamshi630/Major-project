if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const router =  express.Router();
const wrapAsync = require("../utility/wrapAsync.js");
//check login middleware 
const {isLoggedIn, isAdmin, validateListing} = require("../views/checkLoginMiddleware.js");
//require controllers where listings are stored
const  listingController = require("../controllers/listings.js");
//Reyuire multer for uploading files
const multer  = require('multer')
//require cloudinary to store the files data
const {storage} = require("../cloudinaryConfig.js");
const upload = multer({ storage })

router
    .route("/")
    // index Route
    .get(listingController.index)
    // create route 
    .post(isLoggedIn, upload.single('listing[image]'), wrapAsync(listingController.createListing));

// New route 
router.get("/new", isLoggedIn, (req, res) => {
    res.render("listings/new.ejs");
})

router.route("/:id")
// show route
    .get(wrapAsync(listingController.showListings))
    //Update route
    .put(isLoggedIn,isAdmin, upload.single('listing[image]'), wrapAsync(listingController.updateListing))
    //Delete Route 
    .delete(isLoggedIn,isAdmin, wrapAsync(listingController.destroyListing));

// Edit Route 
router.get("/:id/edit", isLoggedIn,isAdmin, wrapAsync(listingController.editListing));

module.exports = router;