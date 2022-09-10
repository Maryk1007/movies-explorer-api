const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const CastError = require('../errors/cast-error');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const { SALT_ROUNDS } = require('../helpers/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

// добавить пользователя
module.exports.createUser = (req, res, next) => {
  const {
    email,
    password,
    name,
  } = req.body;
  bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => {
      res.send({
        email: user.email, name: user.name,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Введены некорректные данные пользователя'));
      } else if (err.code === 11000) {
        next(new ConflictError('Пользователь с указанным email уже существует'));
      } else {
        next(err);
      }
    });
};

// аутентификация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'very-secret-key',
        { expiresIn: '7d' },
      );
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь по указанному _id (${_id}) не найден`);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введен некорректный id пользователя'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res, next) => {
  const { email, name } = req.body;
  const userId = req.user._id;
  User.findOneAndUpdate({ _id: userId }, { email, name }, { new: true, runValidators: true })
    .then((user) => {
      if (user === null) {
        throw new NotFoundError(`Пользователь по указанному _id (${userId}) не найден`);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(NotFoundError).send({ message: 'Запрашиваемый пользователь не найден' });
      } else if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new CastError('Введены некорректные данные пользователя'));
      } else {
        next(err);
      }
    });
};
