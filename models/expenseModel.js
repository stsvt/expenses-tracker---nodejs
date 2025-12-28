const mongoose = require('mongoose');
const slugify = require('slugify');

const schema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      maxLength: 50,
      trim: true,
    },
    slug: String,
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
    active: { type: Boolean, default: true },
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

schema.pre('save', function () {
  this.slug = slugify(this.description, { lower: true });
});

schema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});

schema.pre('aggregate', function () {
  this.pipeline().unshift({ $match: { active: { $ne: false } } });
});
const Expense = mongoose.model('Expense', schema);

module.exports = Expense;
