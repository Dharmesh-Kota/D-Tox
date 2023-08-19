const nodemailer = require('../config/nodemailer');

exports.resetPassword = (token) => {
    
    let htmlString = nodemailer.renderTemplate({token: token}, '/forgot_password/reset_password.ejs');

    nodemailer.transporter.sendMail({
        from: 'dharmeshkota123@gmail.com',
        to: token.user.email,
        subject: 'Link to reset your Password',
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log('Error while sending the Reset Password Link! ', err);
            return;
        }

        console.log('Link Sent!');
    });

}