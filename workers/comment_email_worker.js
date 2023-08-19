const queue = require('../config/kue');
const commentMailer = require('../mailers/comment_mailer');

queue.process('emails', function(job, done){
    console.log('Emails worker is processing a job', job.data);

    commentMailer.newComment(job.data);
    done();
});