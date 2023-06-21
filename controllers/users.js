const User = require('../models/user');

const STATUS_NOT_FOUND = 404;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;

const getUsers = (req, res) => {
  // eslint-disable-next-line no-console
  console.log('req.user._id', req.user._id);
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => res.status(INTERNAL_SERVER_ERROR).send({
      message: 'Internal Server Error',
    }));
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => new Error('Not found'))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(STATUS_NOT_FOUND)
          .send({
            message: 'User not found',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Internal Server Error',
          });
      }
    });
};

const createUser = (req, res) => {
  User.create(req.body)
    .then((user) => res.status(201).send(user))
    .catch(() => res
      .status(INTERNAL_SERVER_ERROR)
      .send({
        message: 'Internal Server Error',
      }));
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(STATUS_NOT_FOUND)
          .send({
            message: 'User not found',
          });
      } else if (err.message === 'Bad Request') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Bad Request',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Internal Server Error',
          });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.message === 'Not found') {
        res
          .status(STATUS_NOT_FOUND)
          .send({
            message: 'User not found',
          });
      } else if (err.message === 'Bad Request') {
        res
          .status(BAD_REQUEST)
          .send({
            message: 'Bad Request',
          });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({
            message: 'Internal Server Error',
          });
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
};
