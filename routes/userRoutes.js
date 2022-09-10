const userRouter = require('express').Router();
const { getMe, updateUser } = require('../controllers/usersController');
const { validateUpdateUser } = require('../middlewares/validation');

userRouter.get('/me', getMe);
userRouter.patch('/me', validateUpdateUser, updateUser);

module.exports = userRouter;
