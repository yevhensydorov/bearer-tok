const express = require("express");
const app = express();

const SERVER_PORT = process.env.PORT || 3003;

const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
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
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 2 * 24 * 60 * 60
    }),
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.set("view engine", "ejs");

require("./app/routes")(app, passport);

app.listen(SERVER_PORT, () => {
  console.info(`Server started at http://localhost:${SERVER_PORT}`);
});
