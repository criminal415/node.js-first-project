const mongoose = require('mongoose');

const { Schema } = mongoose;
const commentsSchema = new Schema({
  _id: Schema.Types.ObjectId,

  userId: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
});

module.exports = mongoose.model('comments', commentsSchema);
