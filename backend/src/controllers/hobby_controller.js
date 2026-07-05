const { json } = require('stream/consumers');
const { getDb, getHobbiesList, getSpentTimesToday, setHobby, setHobbyTime } = require('../database.js');
const { use } = require('react');

// const db = getDb();



const hobbyList = function (req, res) {
    const userId = req.cookies.anon_id;
    const rows = getHobbiesList(userId);
    res.json(rows);
};


const hobbyTimes = function (req, res) {
    const userId = req.cookies.anon_id;
    const rows = getSpentTimesToday(userId);
    res.json(rows);
};

const addHobbyTime = function (req, res) {  
    const jsonData = req.body;
    setHobbyTime(jsonData);
    
    res.send('OK');
};

const addHobby = function (req, res) {
    const userId = req.cookies.anon_id;
    
    const jsonData = {
        userId: userId,
        name: req.body.name,
        description: req.body.description
    };

    const id = setHobby(jsonData);
    res.json({
        message: 'ok',
        id: id
    });
}

const login = function (req, res) {
    checkLogin(req.body);
    res.json({
        message: 'ok'
    })
}

// private helpers



function checkLogin(jsonData) {
    const { name, password } = jsonData;
    console.log(`login: ${name}`);

}


module.exports = { hobbyList, hobbyTimes, addHobbyTime, addHobby, login };