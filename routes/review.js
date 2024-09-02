const express = require("express");
const router =  express.Router({mergeParams : true});
const wrapAsync = require("../utility/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review  = require("../models/review.js");
const ExpressError = require("../utility/expressError.js");
const  { validateReview, isLoggedIn, isReviewAuthor } = require("../views/checkLoginMiddleware.js");
//Require review from controller
const reviewController = require("../controllers/review.js");

//Reviews Post Request
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))

module.exports = router;