'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SponsorSchema = new Schema({
  name: {
      type:String,
      unique: true,
      uppercase: true
  },
  amount: {
      type: Number,
      default: 0
  },
  lastModified: {
      type: Date,
      default: Date.now
  },
  _delegates: [{ type: Schema.Types.ObjectId, ref: 'Registration' }]
});

module.exports = mongoose.model('Sponsor', SponsorSchema);