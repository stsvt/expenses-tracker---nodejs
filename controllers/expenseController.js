const Expense = require('../models/expenseModel');
const { APIFeatures } = require('../utils/apiFeatures');

exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'description,amount,category,date';
  req.query.sort = '-amount';

  next();
};

exports.getExpenses = async (req, res) => {
  try {
    const features = new APIFeatures(Expense.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const expenses = await features.query;

    res.status(200).json({
      status: 'success',
      page,
      limit,
      results: expenses.length,
      data: { expenses },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Something went wrong with fetching!' });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    res.status(200).json({ status: 'success', data: { expense } });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Failed to fetch expense' });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({ status: 'success', data: { expense } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Invalid data sent' });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Failed to delete expense' });
  }
};

exports.deleteAllExpenses = async (req, res) => {
  try {
    await Expense.deleteMany({});
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'fail', message: 'Failed to delete all expenses' });
  }
};

exports.editExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ status: 'success', data: expense });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: 'Failed to edit expense' });
  }
};
