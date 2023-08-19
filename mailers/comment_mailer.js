const nodeMailer = require('../config/nodemailer');

// another way of exporting function module
exports.newComment = (comment) => {

    let htmlString = nodeMailer.renderTemplate({comment: comment}, '/comments/new_comments.ejs');

    nodeMailer.transporter.sendMail({
        from: 'dharmeshkota123@gmail.com',
        to: comment.user.email,
        subject: 'New Comment Added',
        html: htmlString
    }, (err, info) => {
        if(err){
            console.log('Error while sending the Comments Mail ', err);
            return;
        }

        console.log('Message Sent');
        return;
    });
}