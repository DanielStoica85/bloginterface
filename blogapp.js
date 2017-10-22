const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
// Import Models
let Post = require('./models/post');

// Initiate app
const app = express();

// ### BODY PARSER ###

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(methodOverride("_method"));

// Set public folder
app.use(express.static(__dirname + '/public'));

// middleware to send mela to every route
app.use(function(req, res, next) {
    res.locals.containsEditor = false;
    next();
});

// ### DB CONNECTION ###

// Connect to DB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/blogapp_v1", { useMongoClient: true });
let db = mongoose.connection;

// Check DB connection
db.once('open', () => {
    console.log('Connected to MongoDB.');
});

// Check for DB errors
db.on('error', (err) => {
    console.log('Error connecting to database: ');
    console.log(err);
});

// Set Ejs as view engine
app.set('view engine', 'ejs');

// ### MIDDLEWARE ### 

// Express Session Middleware

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Flash Messages Middleware

app.use(require('connect-flash')());

app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware

app.use(expressValidator());

// ### ROUTES ###

// Home Route
app.get('/', (req, res) => {
    Post.getAll((allPosts) => {
        res.render('frontend/home', { posts: allPosts, title: 'Tutorials Blog - Home' });
    });
});

// Admin Route
app.get('/admin', (req, res) => {
    Post.find({}, (err, allPosts) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(allPosts.length);
            res.render('admin/admin', { title: 'Blog Admin', posts: allPosts });
        }
    });
});

// Show form to add new Post
app.get('/posts/new', (req, res) => {
    // res.locals.containsEditor = true;
    Post.getAll((allPosts) => {
        res.render('admin/newPost', { title: 'Add Post', posts: allPosts, containsEditor: true });
    });
});

// Add new Post (after submitting form) route
app.post('/posts', (req, res) => {
    
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

// Show form to add new Post
app.get('/pages/new', (req, res) => {
    res.locals.containsEditor = true;
    Post.getAll((allPosts) => {
        res.render('admin/newPage', { title: 'Add Post' });
    });
});

// Show entire blog post
app.get('/post/:id', (req, res) => {
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
app.get('/post/edit/:id', (req, res) => {
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
app.put('/post/:id', (req, res) => {
    
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
app.delete('/post/delete/:id', (req, res) => {
    Post.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log('Post not deleted!');
            console.log(err);
        }
        else {
            console.log('Post with id ' + req.params.id + ' deleted!');
            // req.flash('success', 'Post deleted!');
            res.json({message: 'Post was deleted'});
        }
    });
});


// Show list of pages
app.get('/admin/pages', (req, res) => {
    res.render('admin/pages', { title: 'Pages', page: 'pages' });
});

// Show list of posts
app.get('/posts', (req, res) => {
    Post.find({}, (err, allPosts) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('admin/posts', { title: 'Posts', posts: allPosts });
        }
    });
});

// Show list of users
app.get('/admin/users', (req, res) => {
    res.render('admin/users', { title: 'Users' });
});

// Show login form
app.get('/admin/login', (req, res) => {
    res.render('admin/login', { title: 'Login' });
});

// Add user route
app.get('/users/new', (req, res) => {
    res.render('admin/newUser', { title: 'Add User' });
});

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Server started on port ' + process.env.PORT + '.');
});
