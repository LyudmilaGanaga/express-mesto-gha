const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Conflict = require('../errors/Conflict');

const getUsers = (req, res, next) => {
  // eslint-disable-next-line no-console
  User
    .find({})
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((users) => res.status(200).send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User
    .findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('User not found');
    })
    .then((user) => res
      .status(200)
      .send({ data: user }))

    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Плохой запрос'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hashPassword) => User
      .create(
        {
          name,
          about,
          avatar,
          email,
          password: hashPassword,
        },
      ))
    .then((user) => {
      res.status(201)
        .send({
          _id: user._id,
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          email: user.email,
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest('BadRequest'));
      }
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new Conflict('Конфликт запроса'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jsonWebToken.sign({ _id: user._id }, 'SECRET', { expiresIn: '7d' });
      res.status(200).send({ token });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail(new NotFoundError('User not found.'))
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest('Плохой запрос'));
      }
      return next(err);
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('User not found.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest('Плохой запрос'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('User not found.'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(new BadRequest('Плохой запрос'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
