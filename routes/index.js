const express = require('express');
const User = require('../models/user');
const passport = require('passport');
const registerSchema = require('../utils/validation');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const createAccountLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: "Too many accounts created from this IP, please try again after an hour"
});

const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: "BruteForce detected !"
});

const checkAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const checkNotAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    return next();
}

router.get("/", checkAuthenticated, (req, res) => {
    console.log(req.user);
    return res.render("index.ejs", {
        user: req.user
    });
});

router.get("/register", createAccountLimiter, checkNotAuthenticated, (req, res) => {
    return res.render("register.ejs", {
        errors: null
    });
});


router.get("/login", loginLimiter, checkNotAuthenticated, (req, res) => {
    return res.render("login.ejs");
});


router.post("/register", createAccountLimiter, checkNotAuthenticated, async (req, res) => {
    let value, hashedPassword;
    try {
        value = await registerSchema.validateAsync({
            name: req.body.name,
            register: req.body.register,
            password: req.body.password
        }, {
            abortEarly: false
        });

    } catch (err) {
        let errors;
        errors = err.details.map((e) => e.message);
        console.error(err);
        return res.render("register.ejs", {
            errors,
            name: req.body.name,
            username: req.body.username
        });
    }
    try {
        hashedPassword = await bcrypt.hash(value.password, 10);
    } catch (err) {
        console.log(hashedPassword);
        console.error(err);
        return res.redirect("/register");
    }

    let user = new User({
        name: value.name,
        password: hashedPassword,
        username: value.username
    });


    try {
        await user.save();
        return res.redirect("/")
    } catch (err) {
        console.error(err);
        return res.redirect("/register");
    }

});

router.post("/login", loginLimiter, checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: true,
    failWithError: true
}));


router.delete("/logout", checkAuthenticated, (req, res) => {
    req.logOut();
    return res.redirect("/login");
});

module.exports = router;