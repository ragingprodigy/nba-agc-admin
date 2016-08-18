/**
 * Created by radiumrasheed on 8/17/16.
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    bcrypt   = require('bcrypt-nodejs');

var pRef = require('../../components/tools/pRef');

// define the schema for our user model
var offlineGroupSchema = new Schema({
    groupName: String
});

// create the model for users and expose it to our app
module.exports = mongoose.model('OfflineGroup', offlineGroupSchema);