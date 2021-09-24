const { ObjectId } = require("bson");
const express = require("express");
const { Mongoose } = require("mongoose");
const Posts = require("../schemas/posts");

const router = express.Router();

router.get("/posts", async (req, res, next) => {
  try {
    
    const postsid={};
    const posts = await Posts.find({}).sort("-date");
    
    for(let i=0; i<posts.length ; i++) {
        
        posts[i].update({'_id': posts[i]['_id'].toString()})
        
    }
        
    res.json({ posts: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/posts/:_id", async (req, res) => {
  const {_id} = req.params;
  
  const post = await Posts.findOne({ _id: _id });
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

// router.post('/posts', async (req, res) => {
//     const { passWord } = req.body;

//     iscorrect = await posts.find({ passWord });
//     if
// }

module.exports = router;