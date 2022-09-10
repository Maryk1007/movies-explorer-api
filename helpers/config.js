const {
  MONGO_URL = process.env.NODE_ENV === 'production' ? process.env.MONGO_URL : 'mongodb://localhost:27017/moviesdb',
  PORT = 3000,
  NODE_ENV,
  JWT_SECRET,
} = process.env;

module.exports = {
  MONGO_URL,
  PORT,
  NODE_ENV,
  JWT_SECRET,
};
