import { DatabaseSync } from 'node:sqlite';

// const db = new DatabaseSync(':memory:');
const db = new DatabaseSync('my.db');

export function initDb() {
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
      description TEXT,
      timestamp INTEGER NOT NULL DEFAULT (CAST(strftime('%s') AS INTEGER)),
      FOREIGN KEY (hobbyId) REFERENCES hobbies(id)
    );
  `);
  
// one time adding field
// db.exec(`ALTER TABLE hobby_time ADD COLUMN description TEXT`);

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT NOT NULL PRIMARY KEY,
      name TEXT
    );
  `);

}

export function getDb() {
  return db;
}

export function createUser(userId: string, name: string) {
  const insert = db.prepare(
    'INSERT INTO users (id, name) VALUES (:id, :name)'
  );

  insert.run({ id: userId, name: name});

  createHobbyExamples(userId);
};

export function createHobbyExamples(userId: string) {
  const insert = db.prepare(
    'INSERT INTO hobbies (userId, name, description) VALUES (:userId, :name, :description)'
  );

  insert.run({ userId: userId, name: 'English', description: 'studying for fan.'});
  insert.run( { userId: userId, name: 'React', description: 'frontend developer skill.'});
  insert.run( { userId: userId, name: 'Armenian', description: 'preparing to exam.'});
};


export function getHobbiesList(userId: string) {
  const rows = db.prepare(
    'SELECT id, name, description FROM hobbies WHERE userId = ? ORDER BY name DESC'
  ).all(userId);

  return rows;
}

export function setHobby(userId: string, name: string, description: string) {
    console.log(`setHobby: userId: ${userId} userName: ${name} userDescription: ${description}`);
    
    const insert = db.prepare(
        'INSERT INTO hobbies (userId, name, description) VALUES (:userId, :name, :description)'
    );
    const result = insert.run({userId: userId, name: name, description: description});
    console.log(`new record Hobby with userId: ${result.lastInsertRowid}`);

    return result.lastInsertRowid;
}


export function getHobbyTimeList(userId: string) {
  const rows = db.prepare('SELECT * FROM hobbies, hobby_time WHERE hobbies.userId = ? AND hobbies.id = hobby_time.hobbyId').all(userId);

  return rows;
};

export function setHobbyTime(hobby_id: number, spent_time: number, description: string) {

  const insert = db.prepare(
  'INSERT INTO hobby_time (hobbyId, spentTime, description) VALUES(:hobbyId, :spentTime, :description)'
  );

  insert.run({
    hobbyId: hobby_id,
    spentTime: spent_time,
    description: description
  });
}

export function getSpentTimesToday(userId: string) {
  const rows = db.prepare(`
    SELECT
      SUM(ht.spentTime) AS spentTime,
      h.name AS name,
      h.description AS description
    FROM hobbies h
    JOIN hobby_time ht ON h.id = ht.hobbyId
    WHERE h.userId = ?
      AND ht.timestamp >= CAST(strftime('%s','now','start of day') AS INTEGER)
      AND ht.timestamp <  CAST(strftime('%s','now','start of day','+1 day') AS INTEGER)

    GROUP BY ht.hobbyId
  `).all(userId);

  return rows;
}

export function getDetailsSpentTimes(hobbyId: number) {
  const rows = db.prepare(`
      SELECT 
        ht.description AS description, 
        ht.spentTime AS spentTime FROM hobby_time ht WHERE ht.hobbyId = ?
    `).all(hobbyId);

  return rows;
}