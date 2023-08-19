const Like = require('../models/like');
const Post = require('../models/posts');
const Comment = require('../models/comments');

module.exports.toggleLike = async function(req, res){
    try {
        
        // /likes/toggle/?id=abcd&type=Post/Comment
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');   
        } else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        let existingLike = await Like.findOne({
            user: req.user._id,
            likeable: req.query.id,
            onModel: req.query.type
        });

        if(existingLike){
            // if a like already exists on Post/Comment then remove it
            likeable.likes.pull(existingLike._id);
            likeable.save();

            deleted = true;
            existingLike.remove();

        } else {
            // Else pull the like from the Post/Comment
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id);
            likeable.save();

        }
        
        return res.status(200).json({
            message: 'Like Request Successful!!',
            data: {
                deleted : deleted
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Internal Server Error!'
        });
    }
}