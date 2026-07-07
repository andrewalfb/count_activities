const express = require('express');
const { init } = require('../controllers/auth_controller');

const router = express.Router();

router.get('/init', init);

module.exports = router;