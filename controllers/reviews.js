const Listing = require("../model/listing.js");
const Review = require("../model/reviews");

module.exports.reviewPost = async (req, res) => {
  const { id } = req.params;
  const userListing = await Listing.findById(id);
  const newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  console.log(newReview);
  userListing.reviews.push(newReview);

  await newReview.save();
  await userListing.save();
  console.log("New review saved");
  req.flash("success", "Review Created")
  res.redirect(`/listings/${userListing._id}`);

};

module.exports.reviewDestroy = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Deleted");
  res.redirect(`/listings/${id}`);
};


