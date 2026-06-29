const { initDb, getDb } = require('./src/database.js');


const express = require('express');
const app = express();
const cors = require('cors');

const hobbyRouter = require('./src/routers/hobby_router.js');

app.use(express.json())
const data = require('./products.json')
app.use(cors());

initDb(); 


app.use('/api/v1/hobby', hobbyRouter)

// app.get("/api/products", (req, res) => {

//     const db = getDb();
//     const rows = db.prepare('SELECT * FROM products ORDER BY price DESC').all();
//     res.json(rows)
// });


// app.get('/api/hobbies', (req, res) => { 
//     const rows = getHobbiesList();
//     res.json(rows);
// });

// app.get('/api/hobby_time', (req, res) => {
//     res.json(getHobbyTimeList());
// });

// app.post('/api/put_time', (req, res) => {
//     console.log(`post: ${req}`);
//     const jsonData = req.body;
//     res.json({
//         message: 'json data received',
//         data: jsonData
//     });
// });


app.listen(5001, () => {
    console.log('Server started on port 5001');
});