//import express
const express = require('express');
const app = express();
//Set Port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  return console.log(`Port is active on: ${PORT}`);
});
//import body parser
const bodyParser = require('body-parser');
app.use(bodyParser.json());
//import error handler;
const errorHandler = require('errorhandler');
app.use(errorHandler());
//import morgan
const morgan = require('morgan');
app.use(morgan('dev'));
//import sqlite3
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/database.sqlite');

//import API Router to be used in server file.
const apiRouter = require ('/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/api/api.js');
app.use('/api', apiRouter);






module.exports = app;
