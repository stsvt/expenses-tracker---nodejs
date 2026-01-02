const Expense = require('../models/expenseModel');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.aliasTopExpenses = (req, res, next) => {
  req.query.limit = '5';
  req.query.fields = 'description,amount,category,date';
  req.query.sort = '-amount';

  next();
};

exports.getExpenses = catchAsync(async (req, res) => {
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
});

exports.getExpenseById = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const expense = await Expense.findById(id);

  if (!expense) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { expense },
  });
});

exports.addExpense = catchAsync(async (req, res) => {
  const expense = await Expense.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { expense },
  });
});

exports.deleteExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const expense = await Expense.findByIdAndDelete(id);

  if (!expense) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.deleteAllExpenses = catchAsync(async (req, res) => {
  await Expense.deleteMany({});
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.editExpense = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const expense = await Expense.findByIdAndUpdate(id, req.body, {
    new: true,
  });

  if (!expense) {
    return next(new AppError('No tour found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: { expense },
  });
});

exports.getExpensesStats = catchAsync(async (req, res) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res) => {
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
});
