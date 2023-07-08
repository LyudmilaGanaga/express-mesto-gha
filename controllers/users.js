const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedCardDeleteException = require('../errors/UnauthorizedCardDeleteException');
const EmailAlreadyExistsException = require('../errors/EmailAlreadyExistsException');

const getUsers = (req, res, next) => {
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
  User.findById(req.user._id)
    .then((user) => res.send(user))
    .catch(next);
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
        return next(new EmailAlreadyExistsException('EmailAlreadyExistsException'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .orFail(() => new Error('User not found'))
    .then((user) => {
      bcrypt.compare(String(password), user.password)
        .then((isValidUser) => {
          if (isValidUser) {
            const jwt = jsonWebToken.sign({
              _id: user._id,
            }, 'SECRET');
            res.cookie('jwt', jwt, {
              maxAge: '7d',
              httpOnly: true,
              sameSite: true,
            });
            res.send({ data: user.toJSON() });
          } else {
            next(new UnauthorizedCardDeleteException('BadRequest'));
          }
        });
    })
    .cath(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('User not found.'))
    .then((users) => res.send(users))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadRequest('BadRequest'));
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
        return next(new BadRequest('BadRequest'));
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
        return next(new BadRequest('BadRequest'));
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
