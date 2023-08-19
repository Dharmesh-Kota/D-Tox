const Post = require('../models/posts');
const Comment = require('../models/comments');
const Like = require('../models/like');

module.exports.create = async function(req, res){
   
    try{
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        if(req.xhr){
            // if we want to populate just the name of the user (we'll not want to send the password in the API), this is how we do it!
            post = await post.populate('user');
            return res.status(200).json({
                data: {
                    post: post
                },
                message: 'Post Created!'
            });
        }
    
        req.flash('success', 'Post created successfully!');
    
        return res.redirect('back');

    } catch(err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        
        if(post.user == req.user.id){
                post.remove();
    
                // deleting comments associated with that post
                await Comment.deleteMany({post: req.params.id});

                await Like.deleteMany({likeable: post._id, onModel: 'Post'});
                await Like.deleteMany({_id: {$in: post.comments}});

                if(req.xhr){
                    return res.status(200).json({
                        data: {
                            post_id: req.params.id
                        },
                        message: 'Post deleted!!'
                    });
                }

                req.flash('error', 'Post and associated Comments removed successfully!');
                
                return res.redirect('back');

        } else {
            req.flash('error', 'You cannot delete this Post!');

            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', err);

        console.log('Error: ', err);
    }
}