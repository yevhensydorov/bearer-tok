const User = require("./models/user");
module.exports = app => {
  app.get("/", (req, res) => {
    res.render("index");
  });

  app.get("/signup", (req, res) => {
    res.render("signup", { message: "Victory" });
  });

  app.post("/signup", (req, res) => {
    const newUser = new User();
    newUser.local.username = req.body.email;
    newUser.local.password = req.body.password;
    newUser.save(err => {
      if (err) throw err;
    });
    res.redirect("/");
  });

  app.get("/:username/:password", (req, res) => {
    const newUser = new User();
    newUser.local.username = req.params.username;
    newUser.local.password = req.params.password;
    console.log(newUser.local.username);
    console.log(newUser.local.password);
    newUser.save(err => {
      if (err) throw err;
    });
    res.send("Success!");
  });
};
