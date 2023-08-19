const express = require('express');
const router = express.Router();
const likes_controller = require('../controller/likes_controller');

router.post('/toggle', likes_controller.toggleLike);

module.exports = router;