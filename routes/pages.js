const express = require('express');
const router = express.Router();

// Import Models
let Post = require('../models/post');

// Show form to add new Page
router.get('/pages/new', (req, res) => {
    res.locals.containsEditor = true;
    Post.getAll((allPosts) => {
        res.render('admin/newPage', { title: 'Add Post' });
    });
});

// Show list of pages
router.get('/admin/pages', (req, res) => {
    res.render('admin/pages', { title: 'Pages', page: 'pages' });
});

module.exports = router;
