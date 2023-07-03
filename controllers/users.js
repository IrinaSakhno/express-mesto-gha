const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const {
  UserNotFound,
  IncorrectUserDataError,
  EmptyUserDataError,
  WrongUserDataError,
  ConflictError,
  UserNotExist,
} = require('../middlewares/error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new UserNotExist();
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new IncorrectUserDataError());
        return;
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.find({ _id })
    .then((user) => {
      if (!user) {
        next(new UserNotFound());
      }
      return res.send(...user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  bcrypt.hash(String(req.body.password), 10)
    .then((hashedPassword) => {
      User.create({
        ...req.body, password: hashedPassword,
      })
        .then((user) => {
          res.send({ data: user });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            next(new IncorrectUserDataError());
            return;
          }
          if (err.code === 11000) {
            next(new ConflictError());
            return;
          }
          next(err);
        });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new EmptyUserDataError());
    return;
  }

  User.findOne({ email })
    .select('+password')
    .orFail(() => new UserNotFound())
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, 'SECRET');
            res.cookie('jwt', jwt, {
              maxAge: 360000,
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            next(new WrongUserDataError());
          }
        })
        .catch(next);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((updateData) => {
      res.status(200).send(updateData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectUserDataError());
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((updateData) => {
      res.status(200).send(updateData);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new IncorrectUserDataError());
        return;
      }
      next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  getCurrentUser,
  login,
  updateProfile,
  updateAvatar,
};
