const mongoose = require('mongoose');
const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');

const getCards = (req, res, next) => {
  Card
    .find({})
    .populate('owner')
    .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card
    .create(
      {
        name,
        link,
        owner: req.user._id,
      },
    )
    .then((card) => res.status(201).send({ data: card }))

    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequest('Плохой запрос'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card
    .findById(cardId)
    .orFail(() => {
      throw new NotFoundError('Card not found');
    })
    .then((card) => {
      const owner = card.owner.toString();
      const _id = req.user._id.toString();
      if (owner === _id) {
        Card.deleteOne(card)
          .then(() => {
            res.status(200).send({ message: 'ОК' });
          })
          .catch(next);
      } else {
        throw new Forbidden('Доступ запрещён');
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Плохой запрос'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFoundError('Card not found');
    })
    .then((card) => res.status(200).send({ data: card, message: 'ОК' }))

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Плохой запрос'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  const userId = req.user._id;
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'BadRequest') {
        next(new BadRequest('Плохой запрос'));
        return;
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
