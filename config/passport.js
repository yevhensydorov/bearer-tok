const LocalStrategy = require("passport-local").Strategy;

const User = require("../app/models/user");

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
              newUser.local.password = password;

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
};
