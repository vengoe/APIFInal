const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userid:{ type: String, unique:true, required: true},
    name:String,
    gamesplayed:Number,
    score:Number
})

const User = mongoose.model("User", userSchema);

module.exports = User