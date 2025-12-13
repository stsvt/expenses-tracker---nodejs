const express = require('express');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

router.param('id', expenseController.checkID);
router
  .route('/')
  .get(expenseController.getExpenses)
  .post(expenseController.checkBody, expenseController.addExpense);

router
  .route('/:id')
  .get(expenseController.getExpenseById)
  .delete(expenseController.deleteExpense)
  .patch(expenseController.editExpense);

module.exports = router;
