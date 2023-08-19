const resetPassword = require('../models/resetPassword');
const User = require('../models/userModel');

module.exports.resetPassword = function(req, res){

    token = req.params.accessToken

    resetPassword.findOne({accessToken: token}, function(err, user){
        if(user.isValid == true){
            console.log(user.isValid);
            // res.locals.token = token
            return res.render('reset_password', {
                title: 'Reset Password',
                token: token
            });
        } else {
            console.log('Track Changed');
            return res.redirect('/users/signIn');
        }
    });    
};

module.exports.reset = function(req, res){
    if(req.body.password == req.body.repass){

        token = req.params.accessToken 
        resetPassword.findOne({accessToken: token}, function(err, user){

            if(err) {console.log('Cannot find user due to error: ', err); return;}

            User.findByIdAndUpdate(user.user, {
                password : req.body.password,
            }, function(err, result){
                if(err){console.log('Error encountered: ', err); return;}
                // console.log(result);
            });

            // console.log(user.user);
            // resetPassword.findOneAndUpdate()
            user.isValid = false;
            user.save();
            console.log(user.isValid);
            return res.redirect('/users/signIn');

        });      
    }
};