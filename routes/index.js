const express = require('express');

const router = express.Router();
//accessing the controller folder
const controllerIndex = require('../controller/index_controller');

//Router-Controller cycle
router.get('/', controllerIndex.home); //redirected to controller rendering home page
router.use('/users', require('./users')); //redirected to controller rendering localhost/users/... section
router.use('/posts', require('./posts')); //redirected to controller rendering localhost/posts/... section
router.use('/comments', require('./comments')); //redirected to controller rendering localhost/comments/... section
router.use('/resetPassword', require('./resetPassword')); //router to reset password
router.use('/likes', require('./likes'));
router.use('/friends', require('./friends'));

router.use('/api', require('./api'));


// console.log("Router folder working okay!!");

module.exports = router;