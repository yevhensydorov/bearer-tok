const router = require("express").Router();
const User = require("./models/user");
const passport = require("passport");

router.get(
  "/test",
  passport.authenticate("bearer", { session: false }),
  (req, res) => {
    res.json({ secretApi: "abc123" });
  }
);

module.exports = router;
