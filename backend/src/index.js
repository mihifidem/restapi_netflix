import express from 'express';
// const express = require('express');
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import cors from 'cors';
const app = express();
import './db.js';
import lookupsRouter from './routes/lookups.js'
app.use(cors());
app.use(express.json());
app.get("/health",(_req , res)=>{
    res.json({status:"ok",service:"Api ok"});
})

app.use('/api/v1/lookups',lookupsRouter);
const port = process.env.PORT || 8000;
app.listen(port,()=>{
      console.log(`API listening at http://localhost:${port}`);

})