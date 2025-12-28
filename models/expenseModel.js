const mongoose = require('mongoose');
const slugify = require('slugify');

const schema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, 'Category is required'],
      minLength: [3, 'Category name must have at least 3 characters'],
      maxLength: [50, 'Category name must have less or equal 50 characters'],
      trim: true,
      enum: {
        values: [
          'health',
          'leisure',
          'home',
          'cafe',
          'education',
          'gifts',
          'groceries',
          'family',
          'training',
          'transport',
          'other',
        ],
        message:
          'Category is either: health, leisure, home, cafe, education, gifts, groceries, family, training, transport, other',
      },
    },
    slug: String,
    description: {
      type: String,
      required: [true, 'Description is required'],
      minLength: [5, 'Description must have at least 5 characters'],
      maxLength: [300, 'Description must have less or equal 300 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.1, 'Amount cannot be less than 0.1'],
      max: [1_000_000, 'Amount cannot be greater than 1.000.000'],
    },
    tags: [{ type: String }],
    date: {
      type: Date,
      default: Date.now,
      min: [new Date('2000-01-01'), 'Date must be after 2000-01-01'],
      validate: {
        validator: function (value) {
          return value <= new Date(Date.now() + 60 * 1000);
        },
        message: 'Date ({VALUE}) cannot be in future',
      },
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
