'use strict';

var mongoose = require('mongoose'),
    Rating = require('./rating.model'),
    Schema = mongoose.Schema;

var SessionSchema = new Schema({
  title: {
      type:String,
      uppercase:true
  },
  description: String,
  venue: {
      type:String,
      uppercase:true
  },
  start_time: Date,
  end_time: Date,
  rating_start: Date,
  canRegister: Boolean,
  speakers : [{ type: Schema.Types.ObjectId, ref: 'Speaker' }],
  questions : [{
    question: String,
    name: String,
    owner: String
  }],
  papers : [{
    speaker: { type: Schema.Types.ObjectId, ref: 'Speaker' },
    title: {
        type:String,
        uppercase:true
    },
    document: String
  }],
  rappoteur : String
});

// generating a hash
SessionSchema.methods.getRatings = function(done) {
    Rating.find({ session: this._id }, 'comment score user')
    .populate('user', 'email')
    .exec(function(err, ratings){
        return done(err, ratings);
    });
};

module.exports = mongoose.model('Session', SessionSchema);