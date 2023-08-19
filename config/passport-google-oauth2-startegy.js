const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/userModel');
const env = require('./environment');

// asking passport to use google-strategy
passport.use(new googleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.google_call_back_url
    },
    function(accessToken, refreshToken, profile, done){
        // find the user
        User.findOne({email : profile.emails[0].value}).exec(function(err, user){
            if(err){
                console.log('Error in google-startegy-passport: ',err);
                return;
            }

            console.log(profile);
            // if found then sign-in the user by setting this user as req.user
            if(user){
                return done(null, user);
            } else {
                // if not found then create the user and sign him up
                User.create({
                    fname: profile.name.givenName,
                    lname: profile.name.familyName,
                    email: profile.emails[0].value,
                    password: crypto.randomBytes(20).toString('hex')
                }, function(err, user){
                    if(err){
                        console.log('Error in google-startegy-passport: ',err);
                        return;
                    }

                    return done(null, user);
                });
            }
        })
    }
));

module.exports = passport;