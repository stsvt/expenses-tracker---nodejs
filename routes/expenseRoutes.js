const express = require('express');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

router
  .route('/')
  .get(expenseController.getExpenses)
  .post(expenseController.addExpense)
  .delete(expenseController.deleteAllExpenses);

router
  .route('/:id')
  .get(expenseController.getExpenseById)
  .delete(expenseController.deleteExpense)
  .patch(expenseController.editExpense);

module.exports = router;
