const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
// const UnauthorizedCardDeleteException = require('../errors/UnauthorizedCardDeleteException');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user.cardId;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'BadRequest') {
        next(new BadRequest('BadRequest'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .populate('owner')
    .orFail(() => new Error('Not found'))
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      return Card.deleteOne({ _id: cardId })
        .then(() => res.status(200).send(card))
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('BadRequest'));
      } else if (err.message === 'Not found') {
        next(new NotFoundError());
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.cardId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('BadRequest'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user.cardId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('BadRequest'));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
