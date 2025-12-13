const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: 0,
  },
});

const Expense = mongoose.model('Expense', schema);

module.exports = Expense;
