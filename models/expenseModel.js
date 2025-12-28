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

schema.virtual('daysAgo').get(function () {
  const day = 24 * 60 * 60 * 1000;
  const now = new Date();

  const diffDays = Math.round(Math.abs((now - this.date) / day));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays >= 2) return `${diffDays} days ago`;
});

const Expense = mongoose.model('Expense', schema);

module.exports = Expense;
