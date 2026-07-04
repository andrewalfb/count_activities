const { initDb, getDb } = require('./src/database.js');

const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

const hobbyRouter = require('./src/routers/hobby_router.js');

app.use(express.json());
app.use(cookieParser());


app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.originalUrl} cookie:`,
    req.cookies.anon_id
  );
    if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.cookies.anon_id) {
    const anonId = Math.random().toString(36).slice(2);

    console.log(
      `Setting cookie ${anonId} for ${req.method} ${req.originalUrl}`
    );

    res.cookie("anon_id", anonId, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
    });
  }

  next();
});

app.use(cors({
  origin: [ 
    "http://localhost:3000"
  ],
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


initDb();

app.use(function simpleLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms) ip: ${req.ip}`);
  });
  console.log(`cookie: ${req.cookies.anon_id}`);
  next();
});

app.use('/api/v1/hobby', hobbyRouter);

app.listen(5001, () => {
  console.log('Server started on port 5001');
});
