'use strict';

var _ = require('lodash');
var Branch = require('./branch.model'),
    Registration = require('../registration/registration.model');

// Get list of branches
exports.index = function(req, res) {
  Branch.find(function (err, branchs) {
    if(err) { return handleError(res, err); }
    return res.json(200, branchs);
  });
};

exports.doMerge = function(req, res) {
    if (req.body.old && req.body.new) {
        Registration.update({branch: req.body.old}, {$set:{branch:req.body.new}}, {multi:true}, function(e, r){
            console.log(e,r);
            return res.status(200).json({message:"Success"});
        });
    } else {
        return res.status(400).json({message: "Invalid Operation"});
    }
};

exports.uniqueList = function(req, res) {
    Registration.aggregate([
        { $match: {statusConfirmed:true, paymentSuccessful:true,certPrinted:{$ne:true}} },
        //{ $match: {statusConfirmed:true, paymentSuccessful:true} },
        { $sort: { branch: -1 } },
        { $group: {
            _id: "$branch",
            count: {$sum:1}
        }}
    ], function(err, data){
        return res.json(data);
    });
};

exports.printData = function(req, res) {
    Registration.find({statusConfirmed:true, paymentSuccessful:true, branch: req.query.branch}).sort({surname:1}).exec(function(err, records){
        return res.json(records);

        Registration.update({branch: req.query.branch}, {$set:{certPrinted:true}}, {multi:true}, function(err){
            if (err) { return handleError(res, err); }

        });
    });
};

exports.vipPrint = function(req, res) {
    Registration.find({statusConfirmed:true, paymentSuccessful:true, registrationType: req.query.vip}).sort({surname:1}).exec(function(err, records){
        return res.json(records);
    });
};

// Get a single branch
exports.show = function(req, res) {
  Branch.findById(req.params.id, function (err, branch) {
    if(err) { return handleError(res, err); }
    if(!branch) { return res.send(404); }
    return res.json(branch);
  });
};

// Creates a new branch in the DB.
exports.create = function(req, res) {
  Branch.create(req.body, function(err, branch) {
    if(err) { return handleError(res, err); }
    return res.json(201, branch);
  });
};

// Updates an existing branch in the DB.
exports.update = function(req, res) {
  console.log('i got here');
  if(req.body._id) { delete req.body._id; }
  Branch.findById(req.params.id, function (err, branch) {
    if (err) { return handleError(res, err); }
    if(!branch) { return res.send(404); }
    var updated = _.merge(branch, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, branch);
    });
  });
};

// Deletes a branch from the DB.
exports.destroy = function(req, res) {
  Branch.findById(req.params.id, function (err, branch) {
    if(err) { return handleError(res, err); }
    if(!branch) { return res.send(404); }
    branch.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
