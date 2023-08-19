const Comment = require('../models/comments');
const Post = require('../models/posts');
const commentMailer = require('../mailers/comment_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function(req, res){
    try{
        let post = await Post.findById(req.body.post);
    
        if(post){
            let comments = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
        
            // updating the comments array added in posts
            post.comments.push(comments); 
            post.save();            

            comments = await comments.populate('user');
            
            // commentMailer.newComment(comments)
            let job = queue.create('emails', comments).save(function(err){
                if(err){ 
                    console.log('Error in reaching the queue'); 
                    return; 
                }

                console.log('Job Enqueued: ', job.id);
            });

            if(req.xhr){

                // populate

                return res.status(200).json({
                    data: {
                        comment: comments
                    },
                    message: 'Comment Created'
                });

            }


            req.flash('success', 'Comment added successfully!');

            return res.redirect('/');
        }
    } catch (err) {
        console.log('Error: ',err);
    }
}

module.exports.destroy = async function(req, res){
    
    try{
        let comment = await Comment.findById(req.params.id);

        if(comment.user == req.user.id){
    
            let postId = comment.post;
            comment.remove();
    
            let post = Post.findByIdAndUpdate(postId, {
                $pull: {
                    comments: req.params.id
                }
            }); 

            Like.deleteMany({likeable: comment._id, onModel: 'Comment'});   
            
            if(req.xhr){
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id
                    },
                    message: 'Comment Deleted!'
                });
            }           

            req.flash('error', 'Comment removed successfully!');
    
            return res.redirect('back');
    
        } else {
            return res.redirect('back');
        }

    } catch (err) {
        console.log('Error: ', err);
    }
}