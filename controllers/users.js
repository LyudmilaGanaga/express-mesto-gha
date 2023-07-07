const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

const getUserById = (req, res, next) => {
  User
    .findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('BadRequest'));
        return;
      }
      next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User not found');
      }
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(BadRequest('BadRequest'));
      } else if (err.message === 'NotFound') {
        next(new NotFoundError('User not found'));
      } else next(err);
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

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest('Email and password are required');
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.cookie('jwt', token, { httpOnly: true });
      res.status(200).send({ message: 'Login successful' });
      next();
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  // const req.user._id;
  User
    .findByIdAndUpdate(
      req,
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
      if (err.name === 'CastError') {
        next(new BadRequest('BadRequest'));
        return;
      }
      next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  // const req = req.user._id;
  User
    .findByIdAndUpdate(
      req,
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
