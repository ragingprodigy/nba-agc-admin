/**
 * Created by radiumrasheed on 8/17/16.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');

var pRef = require('../../components/tools/pRef');

// define the schema for our user model
var offlineUserSchema = new Schema({

    isDirect:Boolean,
    _staff_ : { type: Schema.Types.ObjectId, ref: 'Auth' },
    _doneBy_ : { type: Schema.Types.ObjectId, ref: 'Auth' },
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
    phone: { type: String, default: '' },
    bag: { type: String, default: '' },
    groupName: {
        type: String
    },
    accountType: {
        type: String,
        default: 'single'
    },
    tokenExpires: {
        type: Date,
        default: Date.now
    },
    prefix: String,
    name: String,
    suffix: String,
    firm: String,
    hasTag: Boolean,
    avatar: {
        type: String,
        default: 'https://s3-eu-west-1.amazonaws.com/nba-agc/user.png'
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    tagPrinted: {
        type: Boolean,
        default: false
    },
    fastTracked: {
        type: Boolean,
        default: false
    },
    fastTrackTime: Date,
    _uploaded: { type: Boolean, default: false },
    _uploadTime: Date
});

// create the model for users and expose it to our app
module.exports = mongoose.model('OfflineUser', offlineUserSchema);