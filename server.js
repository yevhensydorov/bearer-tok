const express = require("express");
const app = express();
const SERVER_PORT = process.env.PORT || 3003;

const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");

const configDB = require("./config/database.js");
mongoose.connect(configDB.url);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// configure user session
app.use(
  session({
    secret: "any random, string",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");

// app.get("/", (req, res) => {
//   res.send("Test");
//   console.log(req.cookies);
//   console.log("+++++++++++++++");
//   console.log(req.session);
// });

require("./app/routes.js")(app, passport);

app.listen(SERVER_PORT, () => {
  console.info(`Server started at http://localhost:${SERVER_PORT}`);
});
