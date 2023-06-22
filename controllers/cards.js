const Card = require('../models/card');

const STATUS_NOT_FOUND = 404;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

const getCards = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('req.user._id', req.user._id);
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({
      message: 'Internal Server Error',
    }));
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.message.includes('validation failed')) {
        res.status(BAD_REQUEST).send({ message: 'Bad Request' });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Internal Server Error',
          });
      }
    });
};

const deleteCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndDelete(
      req.params.cardId,
    )
      .orFail(() => new Error('Not found'));
    res.status(200).send(card);
  } catch (err) {
    if (err.message === 'Not found') {
      res
        .status(STATUS_NOT_FOUND)
        .send({
          message: 'Card not found',
        });
    } else if (err.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .send({
          message: 'Bad Request',
        });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Internal server Error',
        });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => new Error('Not found'));
    res.status(200).send(card);
  } catch (err) {
    if (err.message === 'Not found') {
      res
        .status(STATUS_NOT_FOUND)
        .send({
          message: 'Card not found',
        });
    } else if (err.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .send({
          message: 'Bad Request',
        });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Internal server Error',
        });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
      .orFail(() => new Error('Not found'));
    res.status(200).send(card);
  } catch (err) {
    if (err.message === 'Not found') {
      res
        .status(STATUS_NOT_FOUND)
        .send({
          message: 'Card not found',
        });
    } else if (err.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .send({
          message: 'Bad Request',
        });
    } else {
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({
          message: 'Internal server Error',
        });
    }
  }
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
