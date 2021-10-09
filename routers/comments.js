const express = require('express')
const Mongoose = require('mongoose')
const Comments = require('../models/comments')
const Posts = require('../models/posts')
const User = require('../models/user')
const authMiddleware = require('../middlewares/auth-middleware')

const router = express.Router()

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
      await Comments.deleteOne({ comment_id })
      res.send({ result: 'success' })
    } else {
      res.send({ msg: '내 댓글이 아닙니다.' })
    }
})

module.exports = router