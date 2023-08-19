const { response } = require('express');
const Post = require('../../../models/posts');
const Comment = require('../../../models/comments');

module.exports.index = async function(req, res){

    let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        })

    return res.json(200, {
        message: 'List of Posts',
        posts: posts
    });
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        
        if(post.user == req.user.id){
                post.remove();
    
                // deleting comments associated with that post
                await Comment.deleteMany({post: req.params.id});

                // req.flash('error', 'Post and associated Comments removed successfully!');
                
                return res.json(200, {
                    message: 'Post and associated comments deleted successfully!'
                });

        } else {
            return res.json(401, {
                message: 'You cannot delete this post!'
            });
        }
    } catch (err) {
        // req.flash('error', err);
        console.log('******', err);

        return res.json(500, {
            message: 'Internal Server Error'
        });
    }
}