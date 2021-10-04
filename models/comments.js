const mongoose = require('mongoose');

const { Schema } = mongoose;
const commentsSchema = new Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  author: {
    type: String,
    required: true,
    unique: true,
  },
  date: {
    type: String,
    required: true,
  },
  passWord: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model('comments', commentsSchema);
