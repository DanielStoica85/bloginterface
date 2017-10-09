let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// BLOG POST SCHEMA

let postSchema = new Schema({
    title: String,
    image: String,
    content: String,
    category: String,
    author: {type: String, default: 'Daniel'}
});

module.exports = mongoose.model("Post", postSchema);