const User = require("./models/user");
const passport = require("passport");
module.exports = app => {
  app.get("/", (req, res) => {
    res.render("index");
  });

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

  app.get("/:username/:password", (req, res) => {
    const newUser = new User();
    newUser.local.username = req.params.username;
    newUser.local.password = req.params.password;
    // console.log(newUser.local.username);
    // console.log(newUser.local.password);
    newUser.save(err => {
      if (err) throw err;
    });
    res.send("Success!");
  });
};
