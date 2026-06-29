const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');

function initDb() {
  // hobbies db
    db.exec(`
      CREATE TABLE IF NOT EXISTS hobbies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT
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

  const insert = db.prepare(
    'INSERT INTO hobbies (name, description) VALUES (:name, :description)'
  );

  insert.run({ name: 'English', description: 'studying for fan.'});
  insert.run( {name: 'React', description: 'frontend developer skill.'});
  insert.run( {name: 'Armenian', description: 'preparing to exam.'});

}

function getDb() {
  return db;
}


module.exports = { initDb, getDb };
