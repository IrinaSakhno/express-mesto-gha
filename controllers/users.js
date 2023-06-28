const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => res.status(500).send({
      message: 'Could not get users',
      err: err.message,
      stack: err.stack,
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(404).send({
          message: 'User not found',
        });
      } else {
        res.status(500).send({
          message: 'Could not get user',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'User data is incorrect',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(400).send({
          message: 'Could not create user',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateProfile = (req, res) => {
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
        res.status(400).send({
          message: 'Profile data is incorrect',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(400).send({
          message: 'Could not update profile',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const updateAvatar = (req, res) => {
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
        res.status(400).send({
          message: 'Avatar format is incorrect',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(400).send({
          message: 'Could not update avatar',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
