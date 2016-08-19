'use strict';

var _ = require('lodash');
var Invoice = require('./invoice.model');
var mongoose = require('mongoose');
var Async = require('async');
var mailer = require('../../components/tools/mailer');


// Get list of invoices
exports.index = function(req, res) {
  if(req.query.justOne){
    delete req.query.justOne;
    Invoice.find(req.query)
      .populate('_group')
      .sort('-lastModified').exec(function (err, invoices) {
      if(err) { return handleError(res, err); }

      return res.json(200, invoices);
    });
  }else{
    Invoice.find(req.query)
      .populate('_group')
      .populate('registrations', '_id firstName middleName surname conferenceFee email mobile suffix prefix regCode' +
        ' branch registrationCode yearCalled')
      .sort('-lastModified').exec(function (err, invoices) {
      if(err) { return handleError(res, err); }

      return res.json(200, invoices);
    });
  }

};

// Get a single invoice
exports.show = function(req, res) {
  Invoice.findById(req.params.id).populate('_group').exec(function (err, invoice) {
    if(err) { return handleError(res, err); }
    if(!invoice) { return res.send(404); }
    return res.json(invoice);
  });
};

// Creates a new invoice in the DB.
exports.create = function(req, res) {
  req.body.code = Invoice.pRef(5);
  Invoice.create(req.body, function(err, invoice) {
    if(err) { return handleError(res, err); }
    return res.json(201, invoice);
  });
};

// Updates an existing invoice in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Invoice.findById(req.params.id, function (err, invoice) {
    if (err) { return handleError(res, err); }
    if(!invoice) { return res.send(404); }

      var updated ={};
      if (!req.body.notPaid){
        updated = _.merge(invoice, req.body);
        if (updated.invoiceAmount<=Number(updated.bankDeposit)) {
          updated.responseGotten = true;
          updated.paymentSuccessful = true;
          updated.statusConfirmed = true;
        } else {
          updated.responseGotten = true;
          updated.paymentSuccessful = false;
          updated.statusConfirmed = false;
        }
      }else{updated = _.extend(invoice, req.body);}
    delete req.body.notPaid;
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, invoice);
    });
  });
};

// Deletes a invoice from the DB.
exports.destroy = function(req, res) {
  Invoice.findById(req.params.id, function (err, invoice) {
    if(err) { return handleError(res, err); }
    if(!invoice) { return res.send(404); }
    invoice.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

//send collection of material to individual
exports.groupFastTracked = function (req,res) {
  req.query.Time = new Date;
  console.log(req.query);
  console.log(req.body);
  Async.series([function (callback) {
    _.each(req.body,function (reg) {
      //TODO: add sending collection of material to phone number
       mailer.sendGroupCollected(req.query,reg);
    });
    callback();
  }],function (err) {
    if (err)
    {
      return next(err);
    }
    Invoice.update({_id: req.query.id}, { $set: { fastTrackTime: req.query.Time,fastTracked:true} }, function(){
      return res.status(200).json({message:'Collection Message has been sent to Group members Successfully',fastTrackTime: req.query.Time});
    });

  });
};

function handleError(res, err) {
  return res.send(500, err);
}
