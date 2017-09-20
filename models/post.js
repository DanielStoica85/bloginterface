let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// BLOG POST SCHEMA

let postSchema = new Schema({
    title: String,
    image: String,
    video: String,
    body: String
});

module.exports = mongoose.model("Post", postSchema);