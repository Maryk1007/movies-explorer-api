const Movie = require('../models/moviesModel');
const ForbiddenError = require('../errors/forbidden-error');
const CastError = require('../errors/cast-error');
const NotFoundError = require('../errors/not-found-error');

// получить все фильмы
module.exports.getMovies = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => {
      res.send({ data: movies });
    })
    .catch(next);
};

// создать фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CastError).send({ message: 'Переданы некорректные данные при создании фильма' });
      } else {
        next(err);
      }
    });
};

// удалить сохраненный фильм
module.exports.deleteMovie = (req, res, next) => {
  const { id } = req.params;
  const owner = req.user._id;
  Movie
    .findById(id)
    .orFail(() => {
      throw new NotFoundError('Фильм с указанным id не найден');
    })
    .then((movie) => {
      if (String(owner) !== String(movie.owner._id)) {
        throw new ForbiddenError('Невозможно удалить чужой фильм');
      }
      Movie
        .findByIdAndRemove(id)
        .then(() => {
          res.send({ data: movie });
        })
        .catch(next);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new CastError('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};
