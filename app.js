const express = require('express');
const morgan = require('morgan');
const expenseRouter = require('./routes/expenseRoutes');

const app = express();

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());

app.use('/api/v1/expenses', expenseRouter);

module.exports = app;
