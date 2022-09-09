const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    director: {
        type: Number,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        validate: {
            validator(valid) {
              return validator.isURL(valid);
            },
            message: 'Введён некорректный URL',
          },
          required: true,
          type: String,
    },
    trailerLink: {
        validate: {
            validator(valid) {
              return validator.isURL(valid);
            },
            message: 'Введён некорректный URL',
          },
          required: true,
          type: String,
    },
    thumbnail: {
        validate: {
            validator(valid) {
              return validator.isURL(valid);
            },
            message: 'Введён некорректный URL',
          },
          required: true,
          type: String,
    },
    owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    movieId: {
        type: Number,
        required: true,
    },
    nameRU: {
        type: String,
        required: true,
    },
    nameEN: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('movie', movieSchema);