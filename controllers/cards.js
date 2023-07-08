const mongoose = require('mongoose');
const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequest');
const UnauthorizedCardDeleteException = require('../errors/UnauthorizedCardDeleteException');

async function getCards(req, res, next) {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
}

async function createCard(req, res, next) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await Card.create({ name, link, owner: ownerId });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'BadRequest') {
      next(new BadRequest('BadRequest'));
      return;
    }
    next(err);
  }
}
const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Card not found'))
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedCardDeleteException('UnauthorizedCardDeleteException');
      }
      return Card.findByIdAndRemove(req.params.cardId);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest('BadRequest'));
      }
      return next(err);
    });
};

async function likeCard(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Card not found');
    }
    res.send(card);
  } catch (err) {
    next(err);
  }
}

async function dislikeCard(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );
    if (!card) {
      throw new NotFoundError('Card not found');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'BadRequest') {
      next(new BadRequest('BadRequest'));
      return;
    }
    next(err);
  }
}

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
