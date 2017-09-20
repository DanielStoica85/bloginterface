const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// Import Models
let Post = require('./models/post');

// Initiate app
const app = express();

// ### BODY PARSER ###

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ### DB CONNECTION ###

// Connect to DB
mongoose.connect("mongodb://localhost/blogapp_v2", {useMongoClient: true});
let db = mongoose.connection;

// Check connection
db.once('open', () => {
    console.log('Connected to MongoDB.');
});

// Check for DB errors
db.on('error', (err) => {
    console.log(err);
});

// Set Ejs as view engine
app.set('view engine', 'ejs');

// ### ROUTES ###

// Home Route
app.get('/', (req, res) => {
  Post.find({}, (err, allPosts) => {
      if (err) {
          console.log(err);
      }
      else {
          res.render('index', {posts: allPosts});
      }
  });
});

// Show form to add new Post
app.get('/posts/new', (req, res) => {
    res.render('new');
});

// Add new Post (after submitting form) route
app.post('/posts/new', (req, res) => {
    let title = req.body.title;
    let image = req.body.image;
    let video = req.body.video;
    let content = req.body.content;
    let author = req.body.author;
    let newPost = {title: title, image: image, video: video, content: content, author: author};
    Post.create(newPost, (err, addedPost) => {
        if (err) {
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
});

// Show entire blog post
app.get('/post/:id', (req, res) => {
    Post.findById(req.params.id, (err, foundPost) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('showpost', {post: foundPost});
        }
    });
});

app.listen(process.env.PORT, process.env.IP, () => {
  console.log('Server started on port ' + process.env.PORT + '.');
});