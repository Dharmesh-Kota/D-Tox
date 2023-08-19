const express = require('express');
const router = express.Router();

const reset_index = require('../controller/password_reset_controller');

router.get('/:accessToken', reset_index.resetPassword);
router.post('/reset/:accessToken', reset_index.reset);

module.exports = router;