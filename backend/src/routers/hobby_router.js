const express = require('express');
const { hobbyList, addHobbyTime, hobbyTimes, addHobby, login } = require('../controllers/hobby_controller');

const router = express.Router();

router.get('/', hobbyList);
router.get('/times', hobbyTimes);
router.post('/add_time', addHobbyTime);
router.post('/add', addHobby);
router.post('login', login);

module.exports = router;
