const Listing = require("../model/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// 📄 Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// 📝 Render form to create new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// 🔍 Show details of a single listing (with reviews and owner)
module.exports.showLisitng = async (req, res) => {
  const { id } = req.params;
  const userListing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" },
    })
    .populate("owner");

  if (!userListing) {
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
  }

  console.log(userListing);
  res.render("listings/show.ejs", { userListing });
};

// ➕ Create/save new listing
module.exports.createListing = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  newListing.geometry = response.body.features[0].geometry;

  let savedLisitng = await newListing.save();
  console.log(savedLisitng);
  req.flash("success", "New listing created");
  console.log("✅ New listing saved:", newListing);
  res.redirect("/listings");
};

// ✏️ Render edit form for a listing
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const userListing = await Listing.findById(id);

  if (!userListing) {
    req.flash("error", "Listing you requested for does not exists!");
    return res.redirect("/listings");
  }

  let originalImageUrl = userListing.image.url;
  originalImageUrl.replace("/upload", "/upload/h_300,w_250");

  res.render("listings/edit.ejs", { userListing, originalImageUrl });
};

// 🔄 Update listing with edited values
module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
  let url = req.file.path;
  let filename = req.file.filename;
  listing.image = { url, filename };
  await listing.save();
  }
  req.flash("success", "Listing updated");
  res.redirect(`/listings/${id}`);
};

// 🗑️ Delete a listing
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  const deletedListing = await Listing.findOneAndDelete({ _id: id }); // triggers review delete middleware
  console.log("🗑️ Deleted listing:", deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
