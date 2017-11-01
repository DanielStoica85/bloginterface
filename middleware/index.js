var Post = require('../models/post.js');
var middleware = {};

// MIDDLEWARE 
middleware.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    else {
        res.redirect('/users/login');
    }
};

middleware.checkPostOwnership = function(req, res, next) {
    // is user logged in
    if (req.isAuthenticated()) {
        Post.findById(req.params.id, function(err, foundPost) {
            if (err) {
                req.flash('error_message', 'Post not found!');
                res.redirect('back');
            }
            else {
                // does user own the post?
                if (foundPost.author.id.equals(req.user._id)) {
                   next();
                } 
                else {
                    req.flash('error_message', `You don't have permission to do that because you did not add this post.`);
                    res.redirect('back');
                }
            }
        });
    }
    else {
        req.flash('error_message', 'You need to be logged in to do that.');
        res.redirect('back');
    }
};

module.exports = middleware;