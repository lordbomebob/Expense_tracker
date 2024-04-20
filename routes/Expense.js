const express = require('express')
const Router = express.Router()
const ExpenseController = require(`../controllers/Expense`)
//Create Expense report
Router.post('/',ExpenseController.CreateExpense)
//get Exense report
Router.get('/',ExpenseController.GetAllExpense)
//Delete Expense report
Router.delete('/',ExpenseController.DeleteExpense)
module.exports=Router