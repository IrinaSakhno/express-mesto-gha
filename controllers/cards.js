const Card = require('../models/card');
const {
  IncorrectCardDataError, CardNotFound, DeleteRightsError, WrongFormatError,
} = require('../middlewares/error');

const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        next(new IncorrectCardDataError());
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new CardNotFound();
    })
    .then((card) => {
      if (`${card.owner}` !== req.user._id) {
        throw new DeleteRightsError('Удалять можно только свою карточку');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .orFail(() => {
          throw new CardNotFound();
        })
        .then(() => {
          res.send({ message: 'успешно' });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new CardNotFound())
    .then(() => {
      res.send({ message: 'I like it!' });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        next(new CardNotFound());
      } else if (err.name === 'CastError') {
        next(new WrongFormatError());
      }
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new CardNotFound())
    .then(() => {
      res.send({ message: 'Like was successfully removed' });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        next(new CardNotFound());
      } else if (err.name === 'CastError') {
        next(new WrongFormatError());
      }
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
