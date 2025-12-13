const dotenv = require('dotenv');
const fs = require('fs');
const mongoose = require('mongoose');
const Expense = require('./../models/expenseModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(DB).then(() => console.log('DB connection successful!'));

const expenses = JSON.parse(
  fs.readFileSync(`${__dirname}/expenses.json`, 'utf-8'),
);

const seedData = async () => {
  try {
    await Expense.create(expenses);
  } catch (err) {
    console.log(err);
  }

  process.exit();
};

if (process.argv[2] === '--seed') {
  seedData().then(() => console.log('Data successfully loaded!'));
}
