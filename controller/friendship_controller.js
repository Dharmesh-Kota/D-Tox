const User = require('../models/userModel');
const Friendship = require('../models/friendship');

module.exports.friends = async function(req, res){

    try {
        task = 'Add';

        let user = await User.findOne({
            _id: req.query.fromUser,
            friendship : {
                _id: req.query.toUser
            }
        });

        console.log(user);

        if(user){

            let from_user = await User.findByIdAndUpdate(req.query.fromUser, {
                $pull: {
                    friendship: req.query.toUser
                }
            });

            let to_user = await User.findByIdAndUpdate(req.query.toUser, {
                $pull: {
                    friendship: req.query.fromUser
                }
            });

            let friendship1 = await Friendship.findOne({
                from_user: req.query.fromUser,
                to_user: req.query.toUser
            });

            let friendship2 = await Friendship.findOne({
                from_user: req.query.toUser,
                to_user: req.query.fromUser
            });

            // console.log(friendship1 || friendship2);

            if(friendship1){
                await Friendship.findByIdAndDelete(friendship1);
                // friendship1.save();
            } else {
                await Friendship.findByIdAndDelete(friendship2);
                // friendship2.save();
            }

            task = 'Remove';

        } else {

            await User.findByIdAndUpdate(req.query.fromUser, {
                $push: {
                    friendship: req.query.toUser
                }
            });

            await User.findByIdAndUpdate(req.query.toUser, {
                $push: {
                    friendship: req.query.fromUser
                }
            });

            let friend = await Friendship.create({
                from_user: req.query.fromUser,
                to_user: req.query.toUser
            });
        }

        return res.json(200, {
            message: 'Friend Request processed successfully!!',
            data: {
                task: task
            }
        });

    } catch (error) {

        console.log('Error Found: ',error);
        
        return res.status(500).json({
            message: 'Internal Server Error!'
        });

    }
}