const router = require('express').Router();
const userRouter = require('./userRoutes');
const movieRouter = require('./movieRoutes');
const { createUser, login } = require('../controllers/usersController');
const { validateCreateUser, validateLogin } = require('../middlewares/validation');
const NotFoundError = require('../errors/not-found-error');
const { auth } = require('../middlewares/auth');

router.post('/signup', validateCreateUser, createUser);
router.post('/signin', validateLogin, login);

router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

// обработка несуществующих путей
router.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;