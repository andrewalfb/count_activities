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
    
    setHobbyTime(jsonData);
    res.json({
        message: 'json data received',
        data: jsonData
    })
};

const addHobby = function (req, res) {
    const jsonData = req.body;

    const id = setHobby(jsonData);
    res.json({
        message: 'ok',
        id: id
    });
}

// private helpers

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

function setHobby(jsonData) {
    const { name, description } = jsonData;
    console.log(`setHobby function input: ${name} and ${description}`);
    const insert = db.prepare(
        'INSERT INTO hobbies (name, description) VALUES (:name, :description)'
    );
    const result = insert.run({name: name, description: description});
    console.log(`result db is: ${result.lastInsertRowid}`);

    return result.lastInsertRowid;
}



module.exports = { hobbyList, hobbyTimes, addHobbyTime, addHobby };