const Listing = require("../models/listing.js");
const {listingSchema} = require("../schema.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utility/expressError.js");
const Review  = require("../models/review.js");

//creating middleware to check user isUserloggedin
module.exports.isLoggedIn = (req,  res, next) => {
    if(!req.isAuthenticated()){
        // storing original url in a veriable redirectUrl
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in!");
        return res.redirect("/login");
    }
    next();
}

//storing originalUrl in locals
module.exports.savedRedirectUrl  = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

//creating middleware  to check if user is admin
module.exports.isAdmin = async(req, res, next) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing || !listing.owner._id.equals(res.locals.user.id)){
        req.flash("error", "you are not Admin to this page");
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//Server SIde Validation

module.exports.validateListing = (req, res, next) => {
    let {error} =  listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    }else{
        next();
    }
};

// server side  validation for review
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        return next(new ExpressError(400, errMsg));
    } else {
        next();
    }
}

//creating middleware to check user isUserloggedin to delete review

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.user.id)){
        req.flash("error", "you are not Author for this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
}



