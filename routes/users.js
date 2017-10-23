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
    const name = req.body.name;
    const fname = req.body.fname;
    const lname = req.body.lname;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const country = req.body.country;
    const city = req.body.city;
    
    req.checkBody('name', 'Display Name is required.').notEmpty();
    req.checkBody('fname', 'First Name is required.').notEmpty();
    req.checkBody('lname', 'Last Name is required.').notEmpty();
    req.checkBody('email', 'Email is required.').notEmpty();
    req.checkBody('email', 'Email is not valid.').isEmail();
    req.checkBody('password', 'Password is required.').notEmpty();
    req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);
    
    let errors = req.validationErrors();
    
    if (errors) {
        res.render('admin/register', {errors: errors, title: 'Register new user'});
    }
    else {
        let newUser = new User({
            name: name,
            fname: fname,
            lname: lname,
            email: email,
            password: password,
            city: city,
            country: country
        });
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) {
                    console.log(err);
                }
                else {
                    newUser.password = hash;
                    newUser.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            req.flash('success','You are now registered! Please login.');
                            res.redirect('/users/login');
                        }
                    });
                }
            });
        });
    }
    
});

// Login Form
router.get('/login', function(req, res){
  res.render('admin/login', {title: 'Login'});
});

module.exports = router;