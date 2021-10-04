const mongoose = require("mongoose");

const { Schema } = mongoose;
const postsSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true
    },
    passWord: {
        type: Number,
        required: true
    },
    content: {
        type: String        
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'comments',
    }]
});

module.exports = mongoose.model("posts", postsSchema);