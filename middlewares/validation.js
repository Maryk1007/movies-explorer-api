const { celebrate, Joi } = require('celebrate');
// const { regexURL } = require('../helpers/constants');

// валидация при добавлении нового пользователя
const validateCreateUser = celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });

  // валидация при аутентификации
const validateLogin = celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  });

  const validateUpdateUser = celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
    }),
  });


  const validateCreateMovie = celebrate({
  });

  const validateDeleteMovie = celebrate({
  });

  module.exports = {
    validateCreateUser,
    validateLogin,
    validateUpdateUser,
    validateCreateMovie,
    validateDeleteMovie,
  };