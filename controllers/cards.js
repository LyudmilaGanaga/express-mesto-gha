const NotFoundError = require('../errors/NotFoundError');
const Card = require('../models/card');

const BadRequest = require('../errors/BadRequest');
const UnauthorizedCardDeleteException = require('../errors/UnauthorizedCardDeleteException');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'BadRequest') {
        next(new BadRequest('BadRequest'));
        return;
      }
      next(err);
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      } else if (card.owner.toString() !== req.user._id) {
        throw new UnauthorizedCardDeleteException('Запрет удаления');
      } else {
        Card.findByIdAndRemove(cardId)
          .then((removedCard) => res.status(200).send(removedCard))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('BadRequest'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $addToSet: { likes: req.user._id } },
          { new: true },
        )
          .then((removedCard) => res.status(200).send(removedCard))
          .catch((err) => {
            next(err);
          });
      }
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
  const { cardId } = req.params;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card not found');
      } else {
        Card.findByIdAndUpdate(
          req.params.cardId,
          { $pull: { likes: req.user._id } },
          { new: true },
        )
          .then((removedCard) => res.status(200).send(removedCard))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('BadRequest'));
      } else {
        next(err);
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
