const express = require('express');
const expenseRouter = require('./routes/expenseRoutes');

const app = express();

const logger = (req, res, next) => {
  console.log(`[${req.method}] ${req.url} - ${res.statusCode}`);
  next();
};

app.use(logger);
app.use(express.json());

app.use('/api/v1/expenses', expenseRouter);

module.exports = app;
