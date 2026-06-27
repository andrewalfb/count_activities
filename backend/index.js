const { initDb, getDb } = require('./database.js');

const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json())
const data = require('./products.json')
app.use(cors());

initDb(); 


app.get("/api/products", (req, res) => {
    console.log('hit api/products')
    res.json(data)
});


app.get('/api/goods', (req, res) => {
  console.log('goods api is called');
    const db = getDb();
    const rows = db.prepare('SELECT * FROM products ORDER BY price DESC').all();

    res.json(rows);
});



app.listen(5001, () => {
    console.log('Server started on port 5001');
});