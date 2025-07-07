const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.get("/signup", userController.getSignUpUser);

router.post("/signup", wrapAsync(userController.postSignUpUser));

router.get("/login",  userController.loginUser);

router.post("/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), userController.postLoginUser);

router.get("/logout", userController.userLogout)

module.exports = router;

