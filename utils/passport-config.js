const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt');

function initialzie(passport) {

    const authUser = async (username, password, done) => {
        let user;
        try {
            user = await User.findOne({
                username: username
            })
        } catch (err) {
            console.log(err);
            return done(err);
        }

        if (user === null) {
            return done(null, false, {
                message: "User not found !"
            });
        }
        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user);
            }
            return done(null, false, {
                message: "Password incorrect !"
            });
        } catch (err) {
            return done(e);
        }
    }

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, authUser));

    passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser(async (id, done) => {
        let user;
        try {
            user = await User.findOne({
                _id: id
            });
            return done(null, user);
        } catch (err) {
            console.log(err);
            return done(err);
        }
    });

}

module.exports = initialzie;