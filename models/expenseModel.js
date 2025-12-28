const mongoose = require('mongoose');

const schema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      maxLength: 50,
      trim: true,
    },
    description: {
      type: String,
      maxLength: 300,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    tags: [{ type: String }],
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

const Expense = mongoose.model('Expense', schema);

module.exports = Expense;
