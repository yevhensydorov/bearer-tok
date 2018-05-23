const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

const User = require("../app/models/user");
const configAuth = require("./auth");

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          User.findOne({ "local.username": email }, (err, user) => {
            if (err) {
              return done(err);
            } else if (user) {
              return done(null, false, {
                message: "That email is already taken!"
              });
            } else {
              let newUser = new User();
              newUser.local.username = email;
              newUser.local.password = newUser.generateHash(password);

              newUser.save(err => {
                if (err) {
                  throw err;
                } else {
                  return done(null, newUser);
                }
              });
            }
          });
        });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      (req, email, password, done) => {
        process.nextTick(() => {
          User.findOne({ "local.username": email }, (err, user) => {
            if (err) return done(err);
            if (!user) return done(null, false, { message: "No user found." });
            if (!user.validPassword(password)) {
              return done(null, false, { message: "Ooops. Wrong password" });
            }
            return done(null, user);
          });
        });
      }
    )
  );

  passport.use(
    new FacebookStrategy(
      {
        clientID: configAuth.facebookAuth.clientId,
        clientSecret: configAuth.facebookAuth.clientSecret,
        callbackURL: configAuth.facebookAuth.callbackUrl
      },
      (accessToken, refreshToken, profile, cb) => {
        process.nextTick(() => {
          User.findOrCreate({ facebookId: profile.id }, (err, user) => {
            if (err) {
              return cb(err);
            } else if (user) {
              return cb(null, user);
            } else {
              let newUser = new User();
              newUser.facebook.id = profile.id;
              newUser.token = accessToken;
              newUser.facebook.email = profile.emails;
              console.log(newUser);
            }
          });
        });
      }
    )
  );
};
