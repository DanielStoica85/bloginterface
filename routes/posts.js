const express = require('express');
const router = express.Router();

// Import Models
let Post = require('../models/post');

// Show form to add new Post
router.get('/posts/new', (req, res) => {
    // res.locals.containsEditor = true;
    Post.getAll((allPosts) => {
        res.render('admin/newPost', { title: 'Add Post', posts: allPosts, containsEditor: true });
    });
});

// Add new Post (after submitting form) route
router.post('/posts', (req, res) => {
    
    req.checkBody('title', 'Title is required!').notEmpty();
    req.checkBody('image', 'Image URL is required!').notEmpty();
    req.checkBody('content', 'Post content is required!').notEmpty();
    req.checkBody('category', 'At least one category must be added!').notEmpty();
    
    // Get errors
    var errors = req.validationErrors();
    
    if (errors) {
        Post.getAll((allPosts) => {
            res.render('admin/newPost', {errors: errors, partialPost: req.body, posts: allPosts, title: 'Add Post', containsEditor: true});
        });
    }
    else {
        let title = req.body.title;
        let image = req.body.image;
        let content = req.body.content;
        let author = req.body.author;
        let category = req.body.category;
        let newPost = { title: title, image: image, content: content, author: author, category: category };
        console.log(Post);
        Post.addPost(newPost, () => {
            req.flash('success', 'Post was successfully added!');
            res.redirect('/posts');
        }); 
    }
});

// Show entire blog post
router.get('/posts/:id', (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('frontend/showpost', { post: foundPost, title: 'Demo Postshow' });
        }
    });
});

// Load form for editing post
router.get('/posts/edit/:id', (req, res) => {
    Post.getAll((allPosts) => {    
        Post.findById(req.params.id, (err, foundPost) => {
            if (err) {
                console.log(err);
            }
            else {
                res.render('admin/editPost', { post: foundPost, 
                    posts: allPosts, 
                    containsEditor: true, 
                    title: 'Edit Post' });
            }
        });
    });
});

// Update Post (after submitting form) route
router.put('/posts/:id', (req, res) => {
    
    req.checkBody('title', 'Title is required!').notEmpty();
    req.checkBody('image', 'Image URL is required!').notEmpty();
    req.checkBody('content', 'Post content is required!').notEmpty();
    req.checkBody('category', 'At least one category must be added!').notEmpty();
    
    // Get errors
    var errors = req.validationErrors();
    
    if (errors) {
        Post.getAll((allPosts) => {
            Post.findById(req.params.id, (err, foundPost) => {
                if (err) {
                    console.log(err);
                }
                else {
                    res.render('admin/editPost', {post: foundPost, errors: errors, partialPost: req.body, posts: allPosts, title: 'Edit Post', containsEditor: true});
                }
            });    
        });
    }
    
    else {
        console.log(req.params);
        let title = req.body.title;
        let image = req.body.image;
        let content = req.body.content;
        let author = req.body.author;
        let category = req.body.category;
        let newPost = { title: title, image: image, content: content, author: author, category: category };
        console.log(req.params.id);
        Post.findByIdAndUpdate(req.params.id, newPost, (err, updatedPost) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(updatedPost);
                req.flash('success', 'Post updated!');
                res.redirect('/posts');
            }
        });
    }
    
    

});

// Delete blog post route 
router.delete('/posts/delete/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            res.json({message: 'Post was not deleted because of database error. Please try again.'});
            console.log(err);
        }
        else {
            res.json({message: 'Post was deleted!'});
        }
    });
});

// Show list of posts
router.get('/posts', (req, res) => {
    Post.find({}, (err, allPosts) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('admin/posts', { title: 'Posts', posts: allPosts });
        }
    });
});

module.exports = router;