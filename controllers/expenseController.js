const fs = require('fs');

const expenses = JSON.parse(fs.readFileSync('./data/expenses.json', 'utf-8'));

exports.checkID = (req, res, next, val) => {
  const id = +req.params.id;
  const expense = expenses.find((expense) => expense.id === id);

  if (!expense) {
    res.status(404).json({
      status: 'fail',
      message: 'Expense with such ID was not founded',
    });
  }

  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.description || !req.body.category || !req.body.price) {
    res.status(400).json({
      status: 'fail',
      message: 'Description, category and price are required',
    });
  }

  next();
};

exports.getExpenses = (req, res) => {
  res.status(200).json({ status: 'success', data: expenses });
};

exports.getExpenseById = (req, res) => {
  const { id } = req.params;
  const expense = expenses.find((expense) => expense.id === +id);

  res.status(200).json({ status: 'success', data: { expense } });
};

exports.addExpense = (req, res) => {
  const { description, category, price } = req.body;

  const lastExpenseId = expenses.at(-1).id;

  const newExpense = {
    id: lastExpenseId + 1,
    description,
    category,
    price,
  };

  expenses.push(newExpense);

  fs.writeFile('./data/expenses.json', JSON.stringify(expenses), (err) => {
    res.status(201).json({ status: 'success', data: { expense: newExpense } });
  });
};

exports.deleteExpense = (req, res) => {
  const id = +req.params.id;

  const updated = expenses.filter((expense) => expense.id !== id);

  fs.writeFile('./data/expenses.json', JSON.stringify(updated), (err) => {
    res.status(204).json({ status: 'success', data: null });
  });
};
