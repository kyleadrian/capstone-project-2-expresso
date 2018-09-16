//import express
const express = require ('express');
const timesheetsRouter = express.Router({mergeParams: true});
//import Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/database.sqlite');


timesheetsRouter.param('timesheetId', (req, res, next, timesheetId) => {
  const params = {$timesheetId: timesheetId};
  const sql = "SELECT * FROM Timesheet WHERE Timesheet.id = $timesheetId";

  db.get(sql, params, (err, timesheet) => {
    if (err) {
      next(err);
    } else if (timesheet) {
      req.timesheet = timesheet;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Get all timesheets by employeeId
timesheetsRouter.get('/', (req, res, next) => {
  const employeeId = req.params.employeeId;
  const params = {$employeeId: employeeId};
  const sql = 'SELECT * FROM Timesheet WHERE Timesheet.employee_Id = $employeeId';

  db.all(sql, params, (err, timesheets) => {
    if (err) {
      next(err);
    } else {
    res.status(200).send({timesheets: timesheets});
  }
});
});

//Create new timesheet
timesheetsRouter.post('/', (req, res, next) => {
  const employeeId = req.params.employeeId;
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;

  const params = {$employeeId: employeeId, $hours: hours, $rate: rate, $date: date};

  if (!hours || !rate || !date || !employeeId) {
    res.sendStatus(400);
  }

  const sql = 'INSERT INTO Timesheet (hours, rate, date, employee_id) VALUES ($hours, $rate, $date, $employeeId)';

  db.run(sql, params, function (err) {
    if (err) {
      next(err);
    } else {
    db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${this.lastID}`, (err, timesheet) => {
      res.status(201).json({timesheet: timesheet});
    });
  }
});
});

// Update Timesheet
timesheetsRouter.put('/:timesheetId', (req, res, next) => {
  const employeeId = req.params.employeeId;
  const timesheetId = req.params.timesheetId;
  const hours = req.body.timesheet.hours;
  const rate = req.body.timesheet.rate;
  const date = req.body.timesheet.date;

  const params = {$employeeId: employeeId, $timesheetId: timesheetId, $hours: hours, $rate: rate, $date: date};

  const sql = 'UPDATE Timesheet SET employee_Id = $employeeId, hours = $hours, rate = $rate, date = $date WHERE Timesheet.id = $timesheetId';

  if (!employeeId || !timesheetId || !hours || !rate || !date) {
    res.sendStatus(400);
  };

  db.run(sql, params, function(err) {
    if (err) {
      next(err);
    } else {
    db.get(`SELECT * FROM Timesheet WHERE Timesheet.id = ${req.params.timesheetId}`, (err, timesheet) => {
      res.status(200).json({timesheet: timesheet});
        });
      }
  });
});

//Delete a timesheet
timesheetsRouter.delete('/:timesheetId', (req, res, next) => {
  const timesheetId = req.params.timesheetId;
  const params = {$timesheetId: timesheetId};
  const sql = "DELETE FROM Timesheet WHERE Timesheet.id = $timesheetId";

  db.run(sql, params, (err) =>{
    if (err) {
      next(err)
    } else {
          res.sendStatus(204);
    }
  });
});





























module.exports = timesheetsRouter;
