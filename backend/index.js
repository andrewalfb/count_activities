const { initDb, getDb } = require('./src/database.js');


const express = require('express');
const app = express();
const cors = require('cors');

const hobbyRouter = require('./src/routers/hobby_router.js');

app.use(express.json())
const data = require('./products.json')
app.use(cors());

initDb(); 

const simpleLogger = function (req, res, next) {
  const start = Date.now();

  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(
      `${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms) user-agent: ${req.get('user-agent')} ip: ${req.ip}`
    );
  });

  next();
};


app.use(simpleLogger);
app.use('/api/v1/hobby', hobbyRouter)


app.listen(5001, () => {
    console.log('Server started on port 5001');
});