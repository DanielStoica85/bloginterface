const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// https://hnryjms.io/2014/04/authentication/

// User Schema
const UserSchema = mongoose.Schema({
    username:{
        type: String,
        required: true
    },
    fname:{
        type: String,
        required: true
    },
    lname:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    }
});

let User = module.exports = mongoose.model('User', UserSchema);

// METHODS

module.exports.createUser = function (newUser, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(newUser);
            bcrypt.hash(newUser.password, salt, function(err, hash) {
                if (err) {
                    console.log(newUser.password);
                    console.log(err);
                }
                else {
                    newUser.password = hash;
    	            newUser.save(callback);
                }
    	    });
        }
    });
};

module.exports.findUserByUsername = function(username, callback) {
    User.findOne({username: username}, callback);
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};

module.exports.comparePassword = function(enteredPassword, hash, callback) {
    bcrypt.compare(enteredPassword, hash, function(err, isAMatch) {
        if (err) {
            throw err;
        }
        else {
            callback(null, isAMatch);
        }
    }); 
};

