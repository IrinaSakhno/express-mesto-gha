const router = require('express').Router();

const mongoose = require('mongoose');
const { celebrate, Joi } = require('celebrate');

function validateObjectId(value) {
  const isValid = mongoose.isValidObjectId(value);

  if (isValid) return value;

  throw new Error('ID is not valid');
}
const paramsValidationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(validateObjectId),
  }),
};

const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string()
        .required()
        .regex(/https?:\/\/(www)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+#?$/i),
    }),
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate(paramsValidationConfig),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate(paramsValidationConfig),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate(paramsValidationConfig),
  dislikeCard,
);

module.exports = router;
