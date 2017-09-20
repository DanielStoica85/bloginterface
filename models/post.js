let mongoose = require('mongoose');
let Schema = mongoose.Schema;

// BLOG POST SCHEMA

let postSchema = new Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    video: {type: String, required: true},
    content: {type: String, required: true},
    author: {type: String, required: true}
});

module.exports = mongoose.model("Post", postSchema);