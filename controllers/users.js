/* eslint-disable no-unused-vars */
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = (req, res, next) => {
  User
    .findById(req.params._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('BadRequest'));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      res.send(user);
    })
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

  bcrypt.hash(String(password), 10)
    .then((hashedPassword) => User
      .create(
        {
          name,
          about,
          avatar,
          email,
          password: hashedPassword,
        },
      ))
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

const login = (req, res) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('jwt', token, { httpOnly: true });
      res.status(200).send({ message: 'Login successful' });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  const reqUserId = req.user._id;
  User
    .findByIdAndUpdate(
      reqUserId,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('NotFoundError'));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  const reqUserId = req.user._id;
  User
    .findByIdAndUpdate(
      reqUserId,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        next(new NotFoundError('NotFoundError'));
      } else {
        next(err);
      }
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
