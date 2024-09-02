const { query } = require("express");
const Listing = require("../models/listing.js");
//MAP_API
const mapToken =  process.env.MAP_TOKEN;
// Mapbox skd api require for location
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route
module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

//create Listing
module.exports.createListing = async(req, res) => {
    // Accessing the mabBox sdk api to get the lacation of the user
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()
    
    let url =  req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    //create flash  message
    newListing.owner  = req.user._id;
    newListing.image = {url, filename};
    // Storing  the geolocation data in the database
    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}

//Show  route
module.exports.showListings = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({path :"reviews", populate : {path : "author"}}).populate("owner");
    //create flash  Error message
    if(!listing) {
        req.flash("error", "Listing does not exits!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
};

//Edit Listings
module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    //create flash  Error message
    if(!listing) {
        req.flash("error", "Listing does not exits!");
        res.redirect("/listings");
    }
    //For Previe Image
    // let originalUrl = listing.image.url;
    // originalUrl = originalUrl.replace("/upload", "/upload/w_300,h_200");
    // console.log(originalUrl);
    res.render("listings/edit.ejs", {listing});
};

//Update Listings
module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,  req.body.listing);

    if(typeof  req.file !== "undefined") {
        let url =  req.file.path;
        let filename = req.file.filename;
        listing.image = {url,  filename};
        await  listing.save();
    }

    //create flash  message
    req.flash("success", "Listing was Updated!");
    res.redirect(`/listings/${id}`);
};

//Delete Listing
module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    //create flash  message
    req.flash("success", "Listing was deleted!");
    res.redirect("/listings");
};
