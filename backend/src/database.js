const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');

function initDb() {
  // hobbies db
    db.exec(`
      CREATE TABLE IF NOT EXISTS hobbies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId TEXT NOT NULL, 
        name TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (userId) REFERENCES users(id)
      )
    `);

  db.exec(`
    CREATE TABLE IF NOT EXISTS hobby_time (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hobbyId INTEGER NOT NULL,
      spentTime INTEGER NOT NULL,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (hobbyId) REFERENCES hobbies(id)
    );
  `);
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT
    );
  `);

}

function getDb() {
  return db;
}

function createUser(userId, name) {
  const insert = db.prepare(
    'INSERT INTO users (id, name) VALUES (:id, :name)'
  );

  insert.run({ id: userId, name: name});

  createHobbyExamples(userId);
};

function createHobbyExamples(userId) {
  const insert = db.prepare(
    'INSERT INTO hobbies (userId, name, description) VALUES (:userId, :name, :description)'
  );

  insert.run({ userId: userId, name: 'English', description: 'studying for fan.'});
  insert.run( { userId: userId, name: 'React', description: 'frontend developer skill.'});
  insert.run( { userId: userId, name: 'Armenian', description: 'preparing to exam.'});
};


function getHobbiesList(userId) {
  const rows = db.prepare(
    'SELECT id, name, description FROM hobbies WHERE userId = ? ORDER BY name DESC'
  ).all(userId);

  return rows;
}

function setHobby(jsonData) {
    const { userId, name, description } = jsonData;
    console.log(`setHobby: userId: ${userId} userName: ${name} userDescription: ${description}`);
    
    const insert = db.prepare(
        'INSERT INTO hobbies (userId, name, description) VALUES (:userId, :name, :description)'
    );
    const result = insert.run({userId: userId, name: name, description: description});
    console.log(`new record Hobby with userId: ${result.lastInsertRowid}`);

    return result.lastInsertRowid;
}


function getHobbyTimeList(userId) {
  const rows = db.prepare('SELECT * FROM hobbies, hobby_time WHERE hobbies.userId = ? AND hobbies.id = hobby_time.hobbyId').all(userId);

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

function getSpentTimesToday(userId) {
  const rows = db.prepare('SELECT SUM(spentTime) as spentTime, hobbies.name as name, hobbies.description as description FROM hobbies, hobby_time WHERE hobbies.userId = ? AND hobbies.id = hobby_time.hobbyId GROUP BY hobbyId').all(userId);
  
  return rows;
}

module.exports = { initDb, getDb, createUser, getHobbiesList, getSpentTimesToday, setHobby, setHobbyTime };
