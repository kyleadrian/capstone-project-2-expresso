//import express
const express = require ('express');
const apiRouter = express.Router();
//import employeesRouter
const employeesRouter = require('/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/api/employees.js')
apiRouter.use('/employees', employeesRouter);

const menuRouter = require('/Users/kylewiltshire/Desktop/webapicourse/capstone-project-2-expresso/api/menus.js')
apiRouter.use('/menus', menuRouter);


module.exports = apiRouter;
