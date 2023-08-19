const express = require('express');
const router = express.Router();

const friends_controller = require('../controller/friendship_controller');

router.post('/manage', friends_controller.friends);

module.exports = router;