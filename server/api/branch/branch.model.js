'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BranchSchema = new Schema({
  name: {
      uppercase: true,
      type: String
  }
});

module.exports = mongoose.model('Branch', BranchSchema);