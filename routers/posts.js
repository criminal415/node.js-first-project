const { ObjectId } = require("bson");
const express = require("express");
const { Mongoose } = require("mongoose");
const Comments = require("../schemas/comments");
const Posts = require("../schemas/posts");


const router = express.Router();

router.get("/aaa", async (req, res, next) => {
  try {

    const posts = await Posts.find({}).sort("-date");

    for (let i = 0; i < posts.length; i++) {

      posts[i].update({ '_id': posts[i]['_id'].toString() })

    }

    res.json({ posts: posts })
  } catch (err) {

    next(err);
  }
});

router.get("/search/:keyword", async (req, res, next) => {

  const { keyword } = req.params;
  const keywords = keyword.split(' ')
  const list_keywords = []
  for (let i = 0; i < keywords.length; i++) {
    list_keywords.push({ $or: [{ title: { $regex: keywords[i] } }, { content: { $regex: keywords[i] } }] })
  }
  console.log(list_keywords)
  const search_posts = await Posts.find({ $or: list_keywords }).sort("-date")


  res.json({ posts: search_posts });

});

router.get("/posts/:_id", async (req, res) => {
  const { _id } = req.params;

  const post = await Posts.findOne({ _id });
  res.json({ detail: post });
});

router.post('/detail/:_id', async (req, res) => {
  const { passWord } = req.body;
  const { _id } = req.params;
  console.log(_id)
  console.log(passWord)
  const post = await Posts.find({ _id });
  console.log(post[0]["passWord"])
  if (post[0]["passWord"] === parseInt(passWord)) {
    res.send({ msg: "success" });
  } else {
    res.send({ msg: "fail" })
  }
});

router.get("/comments/:_id", async (req, res) => {
  const { _id } = req.params;

  const comments = await Posts.findOne({ _id }).populate('comments');

  res.json({ detail: comments });
});

router.post('/comments/detail/:_id', async (req, res) => {
  const { _id } = req.params;
  const post_id = _id;
  const { author, passWord, content } = req.body;
  let date = new Date().toISOString()
  try {
    await Comments.create({ post_id, author, passWord, content, date });
    let comment = await Comments.find({ post_id, date })
    console.log(comment)
    let posts = await Posts.findOne({ _id: _id })
    console.log(posts)
    await Posts.findOneAndUpdate({ _id: _id }, { $push: { comments: comment } })
    posts = await Posts.findOne({ _id: _id })
    console.log(posts)
  } catch (err) {
    console.error(err);
    // next(err);
    res.send({ result: "fail" })
  }
  res.send({ result: "success" });
});

// router.delete("/comment/delete/:_id", async (req, res) => {
//   const { author } = req.body;
//   console.log(author)
//   await Comments.deleteOne({ author: author })

//   res.send({ result: "success" });
// })

router.post('/posts', async (req, res) => {

  const { user_id, title, passWord, content } = req.body;
  let date = new Date().toISOString()

  await Posts.create({ user_id, title, passWord, content, date });

  res.send({ result: "success" });
});

router.get('/posts/correction/:_id', async (req, res) => {
  const { _id } = req.params;
  // const { passWord } = req.body;

  const post = await Posts.findOne({ _id: _id });


  res.json({ post: post })


});

router.patch("/posts/correction/:_id", async (req, res) => {
  const { _id } = req.params;
  const { user_id, title, passWord, content, } = req.body;
  let date = new Date()

  const ispostid = await Posts.find({ _id });
  if (ispostid.length > 0) {
    await Posts.updateOne({ _id }, { $set: { title } });
    await Posts.updateOne({ _id }, { $set: { user_id } });
    await Posts.updateOne({ _id }, { $set: { passWord } });
    await Posts.updateOne({ _id }, { $set: { content } });
    await Posts.updateOne({ _id }, { $set: { date } });
  }
  res.send({ result: "success" })
})

router.delete("/posts/delete/:_id", async (req, res) => {
  const { _id } = req.params;

  const ispostid = await Posts.find({ _id });
  if (ispostid.length > 0) {
    await Posts.deleteOne({ _id });
  }

  res.send({ result: "success" });
})

module.exports = router;