'use strict';

var _ = require('lodash');
var Sponsor = require('./sponsor.model');

// Get list of sponsors
exports.index = function(req, res) {
  Sponsor.find(function (err, sponsors) {
    if(err) { return handleError(res, err); }
    return res.json(sponsors);
  });
};

// Get a single sponsor
exports.show = function(req, res) {
  Sponsor.findById(req.params.id)
  .populate('_delegates', 'firstName middleName surname prefix suffix regCode email mobile')
  .exec(function (err, sponsor) {
    if(err) { return handleError(res, err); }
    if(!sponsor) { return res.send(404); }
    return res.json(sponsor);
  });
};

// Creates a new sponsor in the DB.
exports.create = function(req, res) {
  Sponsor.create(req.body, function(err, sponsor) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(sponsor);
  });
};

// Updates an existing sponsor in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sponsor.findById(req.params.id, function (err, sponsor) {
    if (err) { return handleError(res, err); }
    if(!sponsor) { return res.send(404); }
    var updated = _.merge(sponsor, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(sponsor);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}