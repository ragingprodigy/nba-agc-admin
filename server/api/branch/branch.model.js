'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BranchSchema = new Schema({
  name: {
      uppercase: true,
      type: String
  },
  code:String,
  order:String,
  fastTracked: {
    type: Boolean,
    default: false
  },
  fastTrackTime: Date
});

module.exports = mongoose.model('Branch', BranchSchema);
