'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SpeakerSchema = new Schema({
  title: {
      type: String,
      default: ''
  },
  name: {
      type: String,
      unique: true,
      uppercase: true,
      required: true
  },
  suffix: {
      type: String,
      default: ''
  },
  email: {
      type: String,
      lowercase: true
  },
  phone: String,
  organization: String,
  photo:{
      type:String,
      default: 'https://s3-eu-west-1.amazonaws.com/nba-agc/user.png'
  },
  photo_base64: String,
  bio: String
});


module.exports = mongoose.model('Speaker', SpeakerSchema);