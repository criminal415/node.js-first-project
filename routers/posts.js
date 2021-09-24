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
    console.log(posts)    
    res.json({ posts: posts });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

// router.get("/posts/:_id", async (req, res) => {
//   const { _id } = req.params;
//   const posts = await Posts.findOne({ postsId: ObjectId(_id) });
//   res.json({ detail: posts });
// });

router.post('/posts', async (req, res) => {
    
    const { usr_id, title, passWord, content } = req.body;
    console.log(usr_id);
    console.log(content);
    let date = new Date().toISOString()
      
    await Posts.create({ usr_id, title, passWord, content, date });
  
    res.send({ result: "success" });
});

// router.post('/posts', async (req, res) => {
//     const { passWord } = req.body;

//     iscorrect = await posts.find({ passWord });
//     if
// }

module.exports = router;