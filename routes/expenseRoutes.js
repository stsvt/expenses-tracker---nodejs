const express = require('express');
const expenseController = require('../controllers/expenseController');

const router = express.Router();

router
  .route('/top-5-highest')
  .get(expenseController.aliasTopExpenses, expenseController.getExpenses);

router.route('/stats').get(expenseController.getExpensesStats);
router.route('/monthly-plan').get(expenseController.getMonthlyPlan);

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
