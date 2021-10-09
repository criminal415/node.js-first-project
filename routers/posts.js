const express = require('express')
const Mongoose = require('mongoose')
const Comments = require('../models/comments')
const Posts = require('../models/posts')
const User = require('../models/user')
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router()

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

router.get('/posts/:_id', async (req, res) => {
  const { _id } = req.params

  const post = await Posts.findOne({ _id })
  res.json({ detail: post })
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
  let date = new Date().toISOString()

  const ispostid = await Posts.find({ _id })
  if (ispostid.length > 0) {
    await Posts.updateMany({ _id }, { $set: { title, content, date } })
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

module.exports = router
