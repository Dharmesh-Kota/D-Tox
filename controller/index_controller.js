const Post = require('../models/posts');
const User = require('../models/userModel');

module.exports.home = async function(req, res){

    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            }
        }).populate('likes');
        
        let users = await User.find({});
        
        return res.render('home', {
            title: 'D-Tox | Login',
            posts: posts,
            all_users: users
        });   
    } catch (err) {
        console.log('Error: ', err);
        return;
    }
         
}