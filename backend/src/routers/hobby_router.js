const express = require('express');
const { hobbyList, addHobbyTime, hobbyTimes } = require('../controllers/hobby_controller');

const router = express.Router();

router.get('/', hobbyList);
router.get('/times', hobbyTimes);
router.post('/add_time', addHobbyTime);

module.exports = router;
