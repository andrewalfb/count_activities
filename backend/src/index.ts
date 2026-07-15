import { initDb } from './database';

import express from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { router as hobbyRouter } from './routers/hobby_router';
import { router as authRouter } from './routers/auth';

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


initDb();

app.use(function simpleLogger(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const ms = Date.now() - start;
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms) ip: ${req.ip} cookie: ${req.cookies.anon_id}`);
  });
  // console.log(`cookie: ${req.cookies.anon_id}`);
      // temporary log db in memory
  //   const db = getDb();
  //   const hobbies = db.prepare(
  //     'SELECT * FROM hobbies'
  //   ).all();
  //  const users = db.prepare(
  //     'SELECT * FROM users'
  //   ).all();

  //   const times = db.prepare(
  //     'SELECT * FROM hobby_time'
  //   ).all();

  //   console.log(users);
  //   console.log(hobbies);
  //   console.log(times);
    //
  
  
  next();
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/hobby', hobbyRouter);

app.listen(5001, () => {
  console.log('Server started on port 5001');
});
