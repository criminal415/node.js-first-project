const mongoose = require('mongoose');

const { Schema } = mongoose;
const usersSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: Number,
    required: true,
  },
  post_id: [
    {
      type: Schema.Types.ObjectId,
      ref: 'posts',
    },
  ],
  comment_id: [
    {
      type: Schema.Types.ObjectId,
      ref: 'comments',
    },
  ],
});

module.exports = mongoose.model('users', usersSchema);
