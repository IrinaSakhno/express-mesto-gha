const router = require('express').Router();
const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

function validateObjectId(value) {
  const isValid = mongoose.isValidObjectId(value);

  if (isValid) return value;

  throw new Error('ID is not valid');
}

const {
  getUsers, getUserById, getCurrentUser, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.get('/', getUsers);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().custom(validateObjectId),
    }),
  }),
  getUserById,
);

router.post('/', createUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(
        /https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i,
      ),
    }),
  }),
  updateAvatar,
);

module.exports = router;
