//import express
const express = require ('express');
const employeesRouter = express.Router();
//import Database
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || '/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/database.sqlite');

const timesheetsRouter = require ('/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/api/timesheets.js');
employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

//Create param to get id.
employeesRouter.param('employeeId', (req, res, next, employeeId) => {
  const params = {$employeeId: employeeId};
  const sql = "SELECT * FROM Employee WHERE Employee.id = $employeeId";

  db.get(sql, params, (err, employee) => {
    if (err) {
      next(err);
    } else if (employee) {
      req.employee = employee;
      next();
    } else {
      res.sendStatus(404);
    }
  });
});

//Get all employees
employeesRouter.get('/', (req, res, next) => {
  const sql = "SELECT * FROM Employee WHERE Employee.is_current_employee = 1";

  db.all(sql, (err, employees) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({employees: employees});
    }
  });
});

//Create new employee
employeesRouter.post('/', (req, res, next) => {
  const name = req.body.employee.name;
  const position = req.body.employee.position;
  const wage = req.body.employee.wage;

  const params = {$name: name, $position:position, $wage: wage};

  const sql = "INSERT INTO Employee (name, position, wage) VALUES ($name, $position, $wage)"

  if (!name || !position || !wage) {
    res.sendStatus(400);
  }

  db.run(sql, params, function (err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${this.lastID}`, (err, employee) => {
        res.status(201).send({employee: employee});
      });
    }
  });
});

// Get Employee by ID
employeesRouter.get('/:employeeId', (req, res, next) => {
  res.status(200).json({employee: req.employee});
});

employeesRouter.put('/:employeeId', (req, res, next) => {
  const name = req.body.employee.name;
  const position = req.body.employee.position;
  const wage = req.body.employee.wage;
  const isCurrentEmployee = req.body.employee.is_current_employee = 0;
  const employeeId = req.params.employeeId

  const params = {$name: name, $position: position, $wage: wage, $isCurrentEmployee: isCurrentEmployee, $employeeId: employeeId};

  const sql = "UPDATE Employee SET name = $name, position = $position, wage = $wage, is_current_employee = $isCurrentEmployee WHERE Employee.id = $employeeId";

  if (!name || !position || !wage) {
    res.sendStatus(400);
  } else if (isCurrentEmployee) {
    isCurrentEmployee = 1;
  }

  db.run(sql, params, function(err) {
    if (err) {
      next(err);
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${employeeId}`, (err, employee) => {
          res.status(200).json({employee: employee});
        });
      }
  });
});

employeesRouter.delete('/:employeeId', (req, res, next) => {
  const employeeId = req.params.employeeId;
  const params = {$employeeId: employeeId};
  const sql = "UPDATE Employee SET is_current_employee = 0 WHERE Employee.id = $employeeId";
  db.run(sql, params, (err) =>{
    if (err) {
      next(err)
    } else {
      db.get(`SELECT * FROM Employee WHERE Employee.id = ${employeeId}`, (err, employee) => {
          res.status(200).json({employee: employee});
    })
  };
});
});






module.exports = employeesRouter;
