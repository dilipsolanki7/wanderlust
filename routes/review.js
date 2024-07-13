//https://expressjs.com/en/4x/api.html#router
const express = require("express");
const router = express.Router({ mergeParams: true }); 
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controller/reviews.js");

//New-Review POST Route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.createReview));

//Delete-Review POST Route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync (reviewController.destroyReview));

//Delete All Reviews POST Route
/* router.delete("/", wrapAsync ( async(req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    await Review.deleteMany({ _id: { $in: listing.reviews } });
    listing.reviews = [];
    await listing.save();
    req.flash("success","All Reviews Deleted!");
    res.redirect(`/listings/${id}`);
})); */


module.exports = router;