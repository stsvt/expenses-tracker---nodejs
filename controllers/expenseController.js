const Expense = require('../models/expenseModel');

exports.getExpenses = async (req, res) => {
  try {
    const queryObj = { ...req.query };
    const excludedFields = ['sort', 'page', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Expense.find(JSON.parse(queryStr));

    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numExpenses = await Expense.countDocuments();
      if (skip >= numExpenses) throw new Error('This page does not exist');
    }

    const expenses = await query;

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
