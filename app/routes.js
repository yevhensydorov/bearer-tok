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

  app.get("/auth/facebook", passport.authenticate("facebook"));

  app.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/" }),
    (req, res) => {
      // Successful authentication, redirect home.
      res.redirect("/profile");
    }
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
