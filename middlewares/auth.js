const jwt = require('jsonwebtoken');
const { UserNotLoggedIn } = require('./error');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    next(new UserNotLoggedIn());
    return;
  }

  req.user = payload;
  next();
};

module.exports = auth;
