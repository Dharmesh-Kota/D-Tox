const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userModel');

// authentication using passport
passport.use(new LocalStrategy({
        usernameField: 'email',
        passReqToCallback: true
    }, function(req, email, password, done){
        // establishing the identity of the user
        User.findOne({email: email}, function(err, user){
            if(err) {
                req.flash('error', err);
                return done(err);
            }

            if(!user || user.password != password){
                req.flash('error', 'Inavalid Username/Password');
                return done(null, false);
            }

            return done(null, user);
        });
    }
));

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// deserializing the user from the key in the cookies
passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        if(err) {
            console.log('Error in finding the user through id obtained by deserializing');
            return done(err);
        }
        return done(null, user);
    });
});

// verifying if the user is authentic

passport.checkAuthentication = function(req, res, next){
    if(req.isAuthenticated()){
        // if the user is authenticated then proceed him from the sign in page
        return next();
    }
    // if the user is not authenticated then send him back to the sign in page
    return res.redirect('/users/signIn');
}

// using authentication as middleware 
passport.setAuthenticatedUser = function(req, res, next){
    if(req.isAuthenticated()){
        // if the user is authenticated then req already contains the data of the user which we will further send to the 
        // views to make use of it
        res.locals.user = req.user;
    }
    next();
}

module.exports = passport;  