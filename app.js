require('dotenv').config();

const mongoose = require('mongoose');
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const error = require('./middlewares/error');
const limiter = require('./middlewares/limiter');
const router = require('./routes/index');

const { MONGO_URL, PORT } = require('./helpers/config');

const app = express();
app.use(helmet());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// логгер запросов
app.use(requestLogger);

// лимиттер запросов
app.use(limiter);

// все роуты
app.use(router);

// логгер ошибок
app.use(errorLogger);

// обрабтчик ошибок для celebrate
app.use(errors());

// цетрализованная обработка ошибок
app.use(error);

async function main() {
  await mongoose.connect(MONGO_URL);
  app.listen(PORT);
}

main();
