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

postSchema.statics.addPost = function (newPost, callback) {
    let Post = this;
    Post.create(newPost, (err, addedPost) => {
        if (err) {
            console.log('DB error!');
            console.log(err);
        }
        else {
            console.log(addedPost._id);
            callback();
        }
    });
};

postSchema.statics.getAll = function (callback) {
    let Post = this;
    Post.find({}, (err, foundPosts) => {
        if (err) {
            console.log('DB error!');
            console.log(err);
        }
        else {
            console.log(foundPosts.length);
            callback(foundPosts);
        }
    });
};

module.exports = mongoose.model("Post", postSchema);