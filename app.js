require('dotenv').config();
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const router = require('./routes');
const { errorHandler } = require('./middlewares/error');

const { PORT = 3000 } = process.env;

const app = express();
app.use(helmet());

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

express.json();
app.use(cookieParser());

app.use(express.json());

app.use(router);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
