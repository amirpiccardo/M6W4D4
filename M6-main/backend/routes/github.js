// github.js
const express = require("express");
const github = express.Router();
const passport = require("passport");
const GitHubStrategy = require("passport-github2").Strategy;
const session = require("express-session");
const jwt = require("jsonwebtoken");
require("dotenv").config();

github.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

github.use(passport.initialize());
github.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

github.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

github.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  async (req, res, next) => {
    const user = req.user;
    const token = jwt.sign(user, process.env.JWT_SECRET);

    const redirectUrl = `${process.env.GITHUB_CALLBACK_URL}/success?token=${encodeURIComponent(
      token
    )}&success=true`;
    res.redirect(redirectUrl);
  }
);

github.get("/oauth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).send("Errore durante il logout");
    }

    req.session.destroy((error) => {
      if (error) {
        return res
          .status(500)
          .send("Errore durante la distruzione della sessione");
      }
      res.redirect("/");
    });
  });
});

module.exports = github;
