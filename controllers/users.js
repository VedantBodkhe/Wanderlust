const Listing = require("../model/listing");
const Review = require("../model/reviews.js");
const User = require("../model/user.js");

module.exports.getSignUpUser = (req, res) => {
  res.render("users/signup.ejs")
};

module.exports.postSignUpUser =  async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to wanderlust!");
      res.redirect("/listings");
    })

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.loginUser = (req, res) => {
  res.render("users/login.ejs")
};

module.exports.postLoginUser = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust!");
  let redirectUrl = res.locals.redirectUrl || "/listings"
  res.redirect(redirectUrl);
};

module.exports.userLogout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out now!");
    res.redirect("/listings");
  })
};

