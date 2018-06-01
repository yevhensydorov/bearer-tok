const User = require("./models/user");
const passport = require("passport");
module.exports = app => {
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/login", (req, res) => {
    res.render("login", { message: req.flash("error") });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "login",
      failureFlash: true
    })
  );

  app.get("/signup", (req, res) => {
    res.render("signup", { message: req.flash("error") });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );

  app.get("/profile", isLoggedIn, (req, res) => {
    res.render("profile", { user: req.user });
  });

  app.get(
    "/auth/facebook",
    passport.authenticate("facebook", { scope: ["email"] })
  );

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      successRedirect: "/profile",
      failureRedirect: "/"
    })
  );

  app.get(
    "/connect/facebook",
    passport.authorize("facebook", { scope: ["email"] })
  );

  app.get(
    "/connect/google",
    passport.authorize("google", { scope: ["profile", "email"] })
  );

  app.get("/connect/local", (req, res) => {
    res.render("connect-local", { message: req.flash("error") });
  });

  app.post(
    "/connect/local",
    passport.authenticate("local-signup", {
      successRedirect: "/profile",
      failureRedirect: "/connect/local",
      failureFlash: true
    })
  );

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};
