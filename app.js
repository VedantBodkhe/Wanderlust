if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
};

// ------------------ IMPORTS ------------------
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const path = require("path");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");

// Custom utilities and models
const ExpressError = require("./utils/ExpressErrors.js");
const listingsRouter = require("./routes/listings");
const reviewsRouter = require("./routes/reviews.js");
const userRouter = require("./routes/user.js");

// ------------------ CONFIG ------------------
const port = 2210;
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
main();

// ------------------ MIDDLEWARE ------------------
// Set up view engine and views directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Parse incoming requests
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form data

// Serve static assets
app.use(express.static(path.join(__dirname, "public")));

// Override HTTP methods (PUT, DELETE)
app.use(methodOverride("_method"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("Error occured in Mongo Session Store", err)
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Optional; handled by maxAge
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
  }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.get("/demoUser", async (req, res) => {
  let fakeUser = new User({
    email: "delta123@gmail.com",
    username: "delta-student"
  });

  let registeredUser = await User.register(fakeUser, "helloworld");
  res.send(registeredUser);
})

// ------------------ ROUTES ------------------
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);


// ------------------ ERROR HANDLING ------------------
// Catch-all route for undefined paths
app.all("/{*any}", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Central error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("error.ejs", { message });
});

// ------------------ SERVER LISTEN ------------------
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
