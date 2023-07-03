const jwt = require('jsonwebtoken');
const { UserNotLoggedIn } = require('./error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(new UserNotLoggedIn());
  }

  req.user = payload;
  next();
};

module.exports = auth;