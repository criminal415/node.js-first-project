const { ObjectId } = require('bson')
const express = require('express')
const Mongoose = require('mongoose')
const Comments = require('../models/comments')
const Posts = require('../models/posts')
const User = require('../models/user')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router()

const postUsersSchema = Joi.object({
  userId: Joi.string().required().min(3),
  password: Joi.string().required().min(5),
  confirmPassword: Joi.string().required(),
})

router.post('/users', async (req, res) => {
  try {
    const { userId, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body)

    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
      })
      return
    }
    const existUsers = await User.find({
      $or: [{ userId }],
    })
    if (existUsers.length) {
      res.status(400).send({
        errorMessage: '이미 사용중인 ID입니다.',
      })
      return
    }

    await User.create({ userId, password })

    res.status(201).send({})
  } catch (err) {
    console.log(err)
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    })
  }
})

const postAuthSchema = Joi.object({
  userId: Joi.string().required(),
  password: Joi.string().required(),
})

router.post('/auth', async (req, res) => {
  try {
    const { userId, password } = await postAuthSchema.validateAsync(req.body)

    const user = await User.findOne({ userId, password })
    console.log(user)
    if (!user) {
      res.status(400).send({
        errorMessage: 'ID 또는 패스워드가 잘못됬습니다.',
      })
      return
    }

    const token = jwt.sign({ userId: user.userId }, 'my-secret-key')
    res.send({
      token,
    })
  } catch (err) {
    console.log(err)
    res.status(400).send({
      errorMessage: '요청한 데이터 형식이 올바르지 않습니다.',
    })
  }
})

router.get('/users/me', authMiddleware, async (req, res) => {
  const { user } = res.locals

  res.send({
    user: {
      userId: user.userId,
    },
  })
})

router.get('/posts', async (req, res, next) => {
  try {
    const posts = await Posts.find({}).sort('-date')

    for (let i = 0; i < posts.length; i++) {
      posts[i].update({ _id: posts[i]['_id'].toString() })
    }

    res.json({ posts: posts })
  } catch (err) {
    next(err)
  }
})

router.get('/search/:keyword', async (req, res, next) => {
  const { keyword } = req.params
  const keywords = keyword.split(' ')
  const list_keywords = []
  for (let i = 0; i < keywords.length; i++) {
    list_keywords.push({
      $or: [
        { title: { $regex: keywords[i] } },
        { content: { $regex: keywords[i] } },
      ],
    })
  }
  console.log(list_keywords)
  const search_posts = await Posts.find({ $or: list_keywords }).sort('-date')

  res.json({ posts: search_posts })
})

router.get('/posts/:_id', async (req, res) => {
  const { _id } = req.params

  const post = await Posts.findOne({ _id })
  res.json({ detail: post })
})

router.get('/comments/:_id', async (req, res) => {
  const { _id } = req.params

  const comments = await Posts.findOne({ _id }).populate({
    path: 'comment_id',
    options: { sort: { date: -1 } },
  })

  res.json({ detail: comments['comment_id'] })
})

router.post('/comments/detail/:_id', authMiddleware, async (req, res) => {
  const post_id = req.params
  const { content } = req.body
  const { user } = res.locals
  const userId = user.userId
  let date = new Date().toISOString()

  try {
    const _id = new Mongoose.Types.ObjectId()
    await Comments.create({ _id, post_id, userId, content, date })
    await User.findOneAndUpdate(
      { userId: userId },
      { $push: { comment_id: _id } }
    )
    await Posts.findOneAndUpdate(
      { _id: post_id },
      { $push: { comment_id: _id } }
    )
  } catch (err) {
    console.error(err)
    // next(err);
    res.send({ result: 'fail' })
  }
  res.send({ result: 'success' })
})

router.patch('/comment/correction/:_id', authMiddleware, async (req, res) => {
  const _id = req.params
  const { comment_id, content } = req.body
  const { user } = res.locals
  const userId = user.userId
  const c_userId = await Comments.findOne({ _id: comment_id })
  let date = new Date().toISOString()

  if (c_userId.userId === userId) {
    await Comments.updateMany({ _id: comment_id }, { $set: { content, date } })
    res.send({ result: 'success' })
  } else {
    res.send({ msg: '내 댓글이 아닙니다.' })
  }
})

router.delete('/comment/delete/:_id', authMiddleware, async (req, res) => {
  const _id = req.params
  const { comment_id } = req.body
  const { user } = res.locals
  const userId = user.userId
  const c_userId = await Comments.findOne({ _id: comment_id })

  if (c_userId.userId === userId) {
    await Posts.findOneAndUpdate({ _id }, { $pull: { comment_id: comment_id } })
    await Comments.deleteOne({ userId, comment_id })
    res.send({ result: 'success' })
  } else {
    res.send({ msg: '내 댓글이 아닙니다.' })
  }
})

router.post('/posts', authMiddleware, async (req, res) => {
  const { title, content } = req.body
  const { user } = res.locals
  const userId = user.userId

  let date = new Date().toISOString()
  const _id = new Mongoose.Types.ObjectId()
  await User.findOneAndUpdate({ userId: userId }, { $push: { post_id: _id } })

  await Posts.create({ _id, userId, title, content, date })

  res.send({ result: 'success' })
})

router.get('/posts/correction/:_id', authMiddleware, async (req, res) => {
  const { _id } = req.params

  const post = await Posts.findOne({ _id: _id })

  res.json({ post: post })
})

router.patch('/posts/correction/:_id', authMiddleware, async (req, res) => {
  const { _id } = req.params
  const { user_id, title, content } = req.body
  let date = new Date()

  const ispostid = await Posts.find({ _id })
  if (ispostid.length > 0) {
    await Posts.updateMany({ _id }, { $set: { title, content, date } })
    // await Posts.updateOne({ _id }, { $set: { content } })
    // await Posts.updateOne({ _id }, { $set: { date } })
  }
  res.send({ result: 'success' })
})

router.delete('/posts/delete/:_id', authMiddleware, async (req, res) => {
  const { _id } = req.params
  const { user } = res.locals
  const userId = user.userId

  await User.findOneAndUpdate({ userId }, { $pull: { post_id: _id } })
  await Posts.deleteOne({ _id })

  res.send({ result: 'success' })
})

module.exports = router
