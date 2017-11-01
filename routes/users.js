const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Import Models
let User = require('../models/user');

// Register Form
router.get('/register',(req, res) => {
    res.render('admin/register', {title: 'Register new user'});
});

router.post('/register', (req, res) => {
    let username = req.body.username;
    let fname = req.body.fname;
    let lname = req.body.lname;
    let email = req.body.email;
    let password = req.body.password;
    let password2 = req.body.password2;
    let country = req.body.country;
    let city = req.body.city;
    
    console.log(req.body);
    console.log(password);
    
    // Validation
    req.checkBody('username', 'Username is required.').notEmpty();
    req.checkBody('fname', 'First Name is required.').notEmpty();
    req.checkBody('lname', 'Last Name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email is not valid.').isEmail();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password', 'Password confirmation is required.').notEmpty();
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);
    
    let errors = req.validationErrors();
    
    if (errors) {
        res.render('admin/register', {errors: errors, title: 'Register new user'});
    }
    else {
        var newUser = new User({
            username: username,
            fname: fname,
            lname: lname,
            email: email,
            password: password,
            city: city,
            country: country
        });
        
        User.createUser(newUser, (err, user) => {
            if (err) {
                console.log(err);
            }
            else {
                req.flash('success_message', 'Congratulations! You are now a proud admin of this blog. Please login.');
                res.redirect('/users/login');
            }
        });
    }
    
});

// Login Form
router.get('/login', function(req, res){
  res.render('admin/login', {title: 'Login', message: req.flash('loginMessage')});
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

// PASSPORT STRATEGY
passport.use(new LocalStrategy({passReqToCallback: true},
    function(req, username, password, done) {
        User.findUserByUsername(username, function(err, user) {
            if (err) {
                throw err;
            }
            if (!user) {
                console.log('Invalid username.');
                req.flash('error_message', 'Incorrect credentials. Please try again.');
                return done(null, false);
            }
            else {
                User.comparePassword(password, user.password, function(err, isAMatch) {
                    if (err) {
                        throw err;
                    }
                    if (isAMatch) {
                        req.flash('success_message', 'Congratulations! You are now logged in as ' + user.username + '.');
                        return done(null, user);
                    }
                    else {
                        console.log('Invalid password.');
                        req.flash('error_message', 'Incorrect credentials. Please try again.');
                        return done(false);
                    }
                });
            }
        });
    }
));

// Login Process
router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/users/login',
    failureFlash: true
}), function(req, res) {
        res.redirect('/cucubau');
});

router.get('/profile', (req, res) => {
    res.render('admin/profile', {title: 'User Profile', user: req.user});
});

router.get('/logout', function(req, res){
	req.logout();
	req.flash('success_message', 'You are now logged out.');
	res.redirect('/users/login');
});

module.exports = router;