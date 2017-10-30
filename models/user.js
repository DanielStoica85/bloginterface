const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

// https://hnryjms.io/2014/04/authentication/

// User Schema
const UserSchema = mongoose.Schema({
    local: {
        name:{
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
    },
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    }
    
    
});

// METHODS

// generating a hash
UserSchema.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);    
};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);