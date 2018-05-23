const express = require("express");
const app = express();
const https = require("https");

const SERVER_PORT = process.env.PORT || 3003;

const fs = require("fs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const flash = require("connect-flash");
const cors = require("cors");

const configDB = require("./config/database.js");
mongoose.connect(configDB.url);
require("./config/passport")(passport);

app.use(cors());
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

require("./app/routes")(app, passport);

const httpsOptions = {
  key: fs.readFileSync("./security/cert.key"),
  cert: fs.readFileSync("./security/cert.pem")
};

app.listen(SERVER_PORT, () => {
  console.info(`Server started at http://localhost:${SERVER_PORT}`);
});
