const express = require('express');
const router = express.Router();
const passport = require('passport');


const controllerIndex = require('../controller/users_controller');

router.get('/signUp', controllerIndex.signUp);
router.get('/signIn', controllerIndex.signIn);
router.post('/createUser', controllerIndex.createUser);

router.post('/update/:id', passport.checkAuthentication, controllerIndex.update);

router.get('/profile/:id', passport.checkAuthentication, controllerIndex.profile);

// use passport as a middleware to authenticate the user
router.post('/createSession', passport.authenticate(
    'local',
    {failureRedirect: '/users/signIn'}
), controllerIndex.createSession);

router.get('/signOut', controllerIndex.clearSession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/users/signIn'}), controllerIndex.createSession);


router.get('/forgetPass', controllerIndex.getEmail);
router.post('/createToken', controllerIndex.createToken);

module.exports = router;