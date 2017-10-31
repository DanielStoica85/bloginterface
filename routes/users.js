const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

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
                req.flash('success', 'Congratulations! You are now a proud admin of this blog. Please login.');
                res.redirect('/users/login');
            }
        });
    }
    
});

// Login Form
router.get('/login', function(req, res){
  res.render('admin/login', {title: 'Login', message: req.flash('loginMessage')});
});

// Login Process
router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/users/login'
}), function(req, res) {
    
});

router.get('/profile', (req, res) => {
    res.render('admin/profile', {title: 'User Profile', user: req.user});
});

router.get('/logout', (req, res) => {
    res.logout();
    res.redirect('/');
});


module.exports = router;