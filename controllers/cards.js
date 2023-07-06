const Card = require('../models/card');

const NotFoundError = require('../errors/NotFoundError');
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
  const owner = req.user.cardId;

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
      } else if (!card.owner.equals(req.user.cardId)) {
        throw new UnauthorizedCardDeleteException('Запрет удаления');
      } else {
        Card.findOneAndDelete({ _id: cardId })
          .then((deletedCard) => res.status(200).send(deletedCard))
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
          { $addToSet: { likes: req.user.cardId } },
          { new: true },
        )
          .then(() => res.status(200).send(card))
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
          { $pull: { likes: req.user.cardId } },
          { new: true },
        )
          .then(() => res.status(200).send(card))
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
