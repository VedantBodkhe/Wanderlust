const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

// ------------------ REVIEW ROUTES ------------------

// Create a review for a listing
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(reviewController.reviewPost)
);

// Delete a specific review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewController.reviewDestroy)
);

module.exports = router;
