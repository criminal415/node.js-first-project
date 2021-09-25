const { ObjectId } = require("bson");
const express = require("express");
const { Mongoose } = require("mongoose");
const Posts = require("../schemas/posts");

const router = express.Router();

router.get("/posts", async (req, res, next) => {
  try {

    const postsid = {};
    const posts = await Posts.find({}).sort("-date");

    for (let i = 0; i < posts.length; i++) {

      posts[i].update({ '_id': posts[i]['_id'].toString() })

    }

    res.json({ posts: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/posts/:_id", async (req, res) => {
  const { _id } = req.params;

  const post = await Posts.findOne({ _id });
  console.log(post)
  res.json({ detail: post });
});

router.post('/posts', async (req, res) => {

  const { user_id, title, passWord, content } = req.body;
  console.log(user_id);
  console.log(content);
  let date = new Date().toISOString()

  await Posts.create({ user_id, title, passWord, content, date });

  res.send({ result: "success" });
});

router.get('/posts/correction/:_id', async (req, res) => {
  const { _id } = req.params;
  // const { passWord } = req.body;
  
  const post = await Posts.findOne({ _id: _id });
  console.log(post)
  
  res.json({ post: post })
   
  
});

router.patch("/posts/correction/:_id", async (req, res) =>{
  const { _id } = req.params;
  const { user_id, title, passWord, content } = req.body;
  let date = new Date().toISOString()

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

router.delete("/posts/delete/:_id", async (req, res) =>{
  const { _id } = req.params;

  const ispostid = await Posts.find({ _id });
  if (ispostid.length > 0) {
    await Posts.deleteOne({ _id });
  }

  res.send({ result: "success" });
})

module.exports = router;