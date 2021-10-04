const mongoose = require("mongoose");

const { Schema } = mongoose;
const usersSchema = new Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    
    password: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("users", usersSchema);