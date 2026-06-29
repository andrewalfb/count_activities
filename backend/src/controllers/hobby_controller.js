const { getDb } = require('../database.js');

const db = getDb();



const hobbyList = function (req, res) {
    const rows = getHobbiesList();
    res.json(rows);
};


const hobbyTimes = function (req, res) {
    const rows = getHobbyTimeList();
    res.json(rows);
};

const addHobbyTime = function (req, res) {
    const jsonData = req.body;
    res.json({
        message: 'json data received',
        data: jsonData
    })
    setHobbyTime(jsonData);
};

// private helps

function getHobbiesList() {
  const rows = db.prepare('SELECT * FROM hobbies ORDER BY name DESC').all();
    
  return rows
};

function getHobbyTimeList() {
  const rows = db.prepare('SELECT * FROM hobby_time').all();

  return rows;
};


function setHobbyTime(jsonData) {
  const { hobby_id, spent_time, timestamp } = jsonData;

  const insert = db.prepare(
    'INSERT INTO hobby_time (hobbyId, spentTime, timestamp) VALUES(:hobbyId, :spentTime, :timestamp)'
  );

  insert.run({
    hobbyId: hobby_id,
    spentTime: spent_time,
    timestamp
  });
}




module.exports = { hobbyList, hobbyTimes, addHobbyTime };