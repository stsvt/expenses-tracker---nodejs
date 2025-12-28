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
      results: expenses.length,
      data: { expenses },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Something went wrong with fetching!',
    });
  }
};

exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findById(id);
    res.status(200).json({
      status: 'success',
      data: { expense },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to fetch expense',
    });
  }
};

exports.addExpense = async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json({
      status: 'success',
      data: { expense },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    await Expense.findByIdAndDelete(id);
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to delete expense',
    });
  }
};

exports.deleteAllExpenses = async (req, res) => {
  try {
    await Expense.deleteMany({});
    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to delete all expenses',
    });
  }
};

exports.editExpense = async (req, res) => {
  try {
    const { id } = req.params;
    const expense = await Expense.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      status: 'success',
      data: { expense },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to edit expense',
    });
  }
};

exports.getExpensesStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      {
        $match: {
          amount: {
            $gte: 100,
          },
        },
      },
      {
        $group: {
          _id: '$category',
          category: { $first: '$category' },
          totalSpent: { $sum: '$amount' },
          avgTransaction: { $avg: '$amount' },
          numTransactions: { $sum: 1 },
          minAmount: { $min: '$amount' },
          maxAmount: { $max: '$amount' },
        },
      },
      { $sort: { totalSpent: -1, _id: 1 } },
    ]);
    res.status(200).json({
      status: 'success',
      data: { stats },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.query.year * 1;
    const month = req.query.month * 1;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const plan = await Expense.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      { $unwind: '$tags' },
      {
        $group: {
          _id: '$tags',
          expenses: {
            $push: { desc: '$description', val: '$amount' },
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          tagName: '$_id',
          expenses: 1,
          totalAmount: 1,
          count: 1,
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.status(200).json({
      status: 'success',
      data: { plan },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message,
    });
  }
};
