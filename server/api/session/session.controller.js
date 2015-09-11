'use strict';

var _ = require('lodash');
var Session = require('./session.model'),
    Rating = require('./rating.model'),
    Attendee = require('./attendee.model'),
    moment = require('moment');

var ObjectId = require('mongoose').Types.ObjectId;

// Get list of sessions
exports.index = function(req, res) {
    Session.find(req.query, 'title start_time end_time venue rating_start speakers description')
    .exec(function (err, sessions) {
        if(err) { return handleError(res, err); }
        return res.json(200, sessions);
    });
};

// Get a single session
exports.show = function(req, res) {
  Session.findById(req.params.id)
  .populate('speakers', '-photo_base64')
  .populate('papers.speaker', '-photo_base64')
  .exec(function (err, session) {
    if(err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    session.getRatings(function(err, ratings){
        session = session.toObject();
        session.ratings = ratings;
        return res.json(session);
    });
  });
};

// Creates a new session in the DB.
exports.create = function(req, res) {
  Session.create(req.body, function(err, session) {
    if(err) { return handleError(res, err); }
    return res.json(201, session);
  });
};

// Updates an existing session in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Session.findById(req.params.id, function (err, session) {
    if (err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    session.speakers = [];
    var updated = _.merge(session, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, session);
    });
  });
};

// Deletes a session from the DB.
exports.destroy = function(req, res) {
  Session.findById(req.params.id, function (err, session) {
    if(err) { return handleError(res, err); }
    if(!session) { return res.send(404); }
    session.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

exports.addPaper = function(req, res) {
    Session.findById(req.params.id, function(err, session){
        if(err) { return handleError(res, err); }
        if(!session) { return res.send(404); }

        session.papers.push(_.pick(req.body, ['speaker', 'document','title']));
        session.save(function(err){
            if(err) { return handleError(res, err); }

            Session.findById(req.params.id)
            .populate('speakers')
            .populate('papers.speaker')
            .exec(function(err, session){
                if(err) { return handleError(res, err); }
                return res.json(session);
            });
        });
    });
};

exports.deletePaper = function(req, res) {
    Session.findById(req.params.id)
    .populate('speakers','-photo_base64')
    .populate('papers.speaker','-photo_base64')
    .exec(function(err, session){
        if(err) { return handleError(res, err); }
        if(!session) { return res.send(404); }

        session.papers = _.filter(session.papers, function(p) { return p._id != req.params.paperId; } );
        session.save(function(err){
            if(err) { return handleError(res, err); }

            return res.json(session);
        });
    });
};

exports.deleteQuestion = function(req, res) {
    Session.findById(req.params.id)
    .populate('speakers','-photo_base64')
    .populate('papers.speaker','-photo_base64')
    .exec(function(err, session){
        if(err) { return handleError(res, err); }
        if(!session) { return res.send(404); }

        session.questions = _.filter(session.questions, function(p) { return p._id != req.params.questionId; } );
        session.save(function(err){
            if(err) { return handleError(res, err); }

            return res.json(session);
        });
    });
};

function handleError(res, err) {
  return res.send(500, err);
}