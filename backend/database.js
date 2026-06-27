const { DatabaseSync } = require('node:sqlite');

const db = new DatabaseSync(':memory:');

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id    INTEGER PRIMARY KEY AUTOINCREMENT,
      name  TEXT    NOT NULL,
      price REAL,
      stock INTEGER DEFAULT 0
    )
  `);

  const insert = db.prepare(
    'INSERT INTO products (name, price, stock) VALUES (:name, :price, :stock)'
  );

  insert.run({ name: 'AirPods Pro', price: 249.99, stock: 50 });
  insert.run({ name: 'MacBook Pro', price: 2499.99, stock: 10 });
  insert.run({ name: 'iPad Air',    price: 749.99, stock: 25 });
}

function getDb() {
  return db;
}

module.exports = { initDb, getDb };
