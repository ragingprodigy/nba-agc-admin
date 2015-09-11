/**
 * Created by oladapo on 6/27/15.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');

var pRef = require('../../components/tools/pRef');

// define the schema for our user model
var userSchema = new Schema({

    email : {
        type: String,
        unique: true,
        lowercase: true
    },
    password     : {
        type: String,
        select: false
    },
    resetToken: {
        type: String,
        default: ''
    },
    name: String,
    role: {
        type: String,
        default: 'nba-user'
    },
    tokenExpires: {
        type: Date,
        default: Date.now
    },
    lastModified: {
        type: Date,
        default: Date.now
    }

});

// methods ======================
userSchema.statics.randomString = function(size) {
    size = size || 32;
    return pRef(size);
};

// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password, done) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        done(err, isMatch);
    });
};

// create the model for users and expose it to our app
module.exports = mongoose.model('Auth', userSchema);