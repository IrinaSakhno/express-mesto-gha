const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((card) => res.status(200).send(card))
    .catch((err) => res.status(500).send({
      message: 'Could not get cards',
      err: err.message,
      stack: err.stack,
    }));
};

const createCard = (req, res) => {
  Card.create({
    ...req.body,
    owner: req.user._id,
  })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: "Card's data is incorrect" });
      } else {
        res.status(500).send({
          message: 'Could not create card',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => new Error('Not found'))
    .then(() => {
      res.send({ message: 'Card was successfully deleted' });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res.status(404).send({ message: 'Card not found' });
      } else if (err.name === 'CastError') {
        res.status(400).send({ message: 'Wrong ID format' });
      } else {
        res.status(500).send({
          message: 'Could not delete card',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then(() => {
      res.send({ message: 'I like it!' });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Card not found',
          });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'Card ID is incorrect',
            err: err.message,
            stack: err.stack,
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Could not put like',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => new Error('Not found'))
    .then(() => {
      res.send({ message: 'Like was successfully removed' });
    })
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(404)
          .send({
            message: 'Card not found',
          });
      } else if (err.name === 'CastError') {
        res
          .status(400)
          .send({
            message: 'Card ID is incorrect',
            err: err.message,
            stack: err.stack,
          });
      } else {
        res
          .status(500)
          .send({
            message: 'Could not remove like',
            err: err.message,
            stack: err.stack,
          });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
