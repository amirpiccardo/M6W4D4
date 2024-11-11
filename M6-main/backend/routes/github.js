const express = require('express');
const github = express.Router();
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const session = require('express-session');
const jwt = require('jsonwebtoken');
require('dotenv').config();

github.use(
    session({
        secret: process.env.GITHUB_CLIENT_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);

// Inizializziamo Passport
github.use(passport.initialize());
github.use(passport.session());

// Serializzazione della sessione utente
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Configurazione GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: 'http://localhost:4040/auth/github/callback', // Assicurati che sia corretto
        },
        (accessToken, refreshToken, profile, done) => {
            console.log("GitHub Profile:", profile);  // Log del profilo utente
            return done(null, profile);
        }
    )
);

// Route di autenticazione iniziale
github.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

// Callback GitHub dopo l'autenticazione
github.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/' }),
    async (req, res, next) => {
        const user = req.user;
        const token = jwt.sign(user, process.env.JWT_SECRET);
        
        console.log("Generated Token:", token);  // Log del token generato

        const redirectUrl = `http://localhost:5173/success?token=${encodeURIComponent(token)}`;
        res.redirect(redirectUrl);
    }
);

// Route di logout
github.get('/oauth/logout', (req, res) => {
    req.logout((err) => {
        if (err) {
            return res.status(500).send('Errore durante il logout');
        }

        req.session.destroy((error) => {
            if (error) {
                return res.status(500).send('Errore durante la distruzione della sessione');
            }
            res.redirect('/');
        });
    });
});

module.exports = github;
