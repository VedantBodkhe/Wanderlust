const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews");
const { string, required } = require("joi");

// Define the Listing schema
const listingSchema = new Schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: {
    type: Number,
    default: 50000,
  },
  location: {
    type: String,
    default: "Maharashtra",
  },
  country: {
    type: String,
    default: "INDIA",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
       type: {
        type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
        required: true

    },
    coordinates: {
      type: [Number],
        required: true


    }
  }
});

// Middleware: Delete all reviews associated with a listing after deletion
listingSchema.post("findOneAndDelete", async (userListing) => {
  if (userListing) {
    await Review.deleteMany({ _id: { $in: userListing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
