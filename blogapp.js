const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const morgan       = require('morgan');
const cookieParser = require('cookie-parser');

const config = require('./config/database');

// Import Models
let Post = require('./models/post');
let User = require('./models/user');

// Routes
var postRoutes = require('./routes/posts');
var pageRoutes = require('./routes/pages');
var userRoutes = require('./routes/users');

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
mongoose.connect(process.env.MONGODB_URI || config.database, { useMongoClient: true });
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

// Express Flash Messages Middleware

app.use(flash()); // use connect-flash for flash messages stored in session

// PASSPORT 

// required for passport - Express Session Middleware
app.use(session({ 
    secret: 'blablabla',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)

// middleware to send global vars to every route
app.use(function(req, res, next) {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
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

// requiring routes
app.use(postRoutes);
app.use(pageRoutes);
// require user route in a different way so '/users' can be removed from every route
app.use('/users', userRoutes);

app.listen(process.env.PORT, process.env.IP, () => {
    console.log('Server started on port ' + process.env.PORT + '.');
});
