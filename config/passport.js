const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
            } else if (!req.user) {
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
            } else {
              let user = req.user;
              user.local.username = email;
              user.local.password = user.generateHash(password);

              user.save(err => {
                if (err) {
                  throw err;
                } else {
                  return done(null, user);
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
        callbackURL: configAuth.facebookAuth.callbackUrl,
        profileURL: "https://graph.facebook.com/v3.0/me",
        authorizationURL: "https://www.facebook.com/v3.0/dialog/oauth",
        tokenURL: "https://graph.facebook.com/v3.0/oauth/access_token",
        profileFields: ["email", "first_name", "last_name", "gender", "link"],
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, cb) => {
        process.nextTick(() => {
          //user is not logged in yet
          if (!req.user) {
            User.findOne({ facebookId: profile.id }, (err, user) => {
              if (err) {
                return cb(err);
              } else if (user) {
                return cb(null, user);
              } else {
                let newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.name = `${profile.name.givenName} ${
                  profile.name.familyName
                }`;
                newUser.facebook.email = profile.emails[0].value;
                newUser.save(err => {
                  if (err) {
                    throw err;
                  } else {
                    return cb(null, newUser);
                  }
                });
              }
            });
          }
          //user is already logged in
          else {
            let user = req.user;
            user.facebook.id = profile.id;
            user.facebook.token = accessToken;
            user.facebook.name = `${profile.name.givenName} ${
              profile.name.familyName
            }`;
            user.facebook.email = profile.emails[0].value;
            user.save(err => {
              if (err) {
                throw err;
              } else {
                return cb(null, user);
              }
            });
          }
        });
      }
    )
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: configAuth.googleAuth.clientId,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackUrl,
        passReqToCallback: true
      },
      (req, accessToken, refreshToken, profile, cb) => {
        process.nextTick(() => {
          //user is not logged in yet
          if (!req.user) {
            User.findOne({ googleId: profile.id }, (err, user) => {
              if (err) {
                return cb(err);
              } else if (user) {
                return cb(null, user);
              } else {
                let newUser = new User();
                newUser.google.id = profile.id;
                newUser.google.token = accessToken;
                newUser.google.name = profile.displayName;
                newUser.google.email = profile.emails[0].value;
                newUser.save(err => {
                  if (err) {
                    throw err;
                  } else {
                    return cb(null, newUser);
                  }
                });
              }
            });
          }
          //user is already logged in
          else {
            let user = req.user;
            user.google.id = profile.id;
            user.google.token = accessToken;
            user.google.name = profile.displayName;
            user.google.email = profile.emails[0].value;
            user.save(err => {
              if (err) {
                throw err;
              } else {
                return cb(null, user);
              }
            });
          }
        });
      }
    )
  );
};
