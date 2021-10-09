const express = require('express')
const Mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router()

const postUsersSchema = Joi.object({
  userId: Joi.string()
    .pattern(new RegExp(/^[a-zA-Z0-9]{3,20}$/))
    .required(),
  password: Joi.string().required().min(5),
  confirmPassword: Joi.string().required(),
});

router.post('/users', async (req, res) => {
  try {
    const { userId, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body);
    const existUsers = await User.find({ userId });

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
      });
      return;
    } else if (existUsers.length) {
      res.status(400).send({
        errorMessage: '이미 사용중인 ID입니다.',
      });
      return;
    } else if (userId == password) {
      res.status(400).send({
        errorMessage: '비밀번호는 ID와 다른 값이여야 합니다.',
      });
    }

    await User.create({ userId, password });

    res.status(201).send({});
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

const postAuthSchema = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().required(),
});

router.post('/auth', async (req, res) => {
  try {
    const { userId, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ userId, password });
    console.log(user);
    if (!user) {
      res.status(400).send({
        errorMessage: 'ID 또는 패스워드가 잘못됬습니다.',
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, 'my-secret-key');
    res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    });
  }
});

router.get('/users/me', authMiddleware, async (req, res) => {
  const { user } = res.locals;

  res.send({ user: user.userId });
});

module.exports = router
