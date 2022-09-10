const Movie = require('../models/moviesModel');
const ForbiddenError = require('../errors/forbidden-error');
const CastError = require('../errors/cast-error');
const NotFoundError = require('../errors/not-found-error');

// получить все фильмы
module.exports.getMovies = (req, res, next) => {
  Movie.find({})
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
  const ownerId = req.user._id;
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
    owner: ownerId,
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
  const { movieId } = req.params;
  const userId = req.user._id;
  Movie
    .findById(movieId)
    .orFail(() => {
      throw new NotFoundError('Фильм с указанным id не найден');
    })
    .then((movie) => {
      if (String(userId) !== String(movie.owner._id)) {
        throw new ForbiddenError('Невозможно удалить чужой фильм');
      }
      Movie
        .findByIdAndRemove(movieId)
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
