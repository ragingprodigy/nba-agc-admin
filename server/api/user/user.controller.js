'use strict';

var _ = require('lodash');
var User = require('./user.model');
var Registration = require('../registration/registration.model');

var ObjectId = require('mongoose').Types.ObjectId;

// Get User Tags for Printing
exports.getTags = function(req, res) {

    var sendData = function(response) {
        return res.json(response);
    };

    if (typeof req.query.tags == "string") { req.query.tags = [req.query.tags]; }

    // Get Users
    User.find({_id: {$in: req.query.tags}}, function(err, usersWithTags){

        var response = [];

        if (typeof req.query.tags == "string") {

            console.log('Doing...Single');
            // Get Registration Info
            Registration.findOne({user: new ObjectId(req.query.tags)}, function(err, reg){

                var u = usersWithTags[0];

                response.push((u.hasTag?{
                    title: u.prefix,
                    suffix: u.suffix,
                    name: u.name,
                    company: u.firm,
                    id: u._id,
                    code: reg?(reg.regCode+'-'+ reg.conferenceFee):''
                }:reg?{
                    title: reg.prefix,
                    suffix: reg.suffix,
                    name: reg.firstName+' '+ (!reg.middleName.length?'':(reg.middleName.substring(0,1)+'. '))+ reg.surname,
                    company: reg.registrationType!='judge'&&reg.registrationType!='magistrate'?reg.company:(reg.court+' '+reg.state+' '+reg.division),
                    id: u._id,
                    code: reg.regCode+'-'+ reg.conferenceFee
                }:{}));

                User.update({_id: {$in: req.query.tags}}, {'$set': {tagPrinted:true, lastModified:new Date()}}, function() { return; });

                return sendData(response);

            });
        } else {
            // Get Registration Info
            Registration.find({user: {$in: req.query.tags}}, function(err, regs){

                _.each(usersWithTags, function(u) {
                    var theReg = _.find(regs, { 'user':u._id });
                    //var theReg = _.find(regs, function(r) { console.log('%s == %s', r.user, u._id); return r.user== u._id; });

                    response.push((u.hasTag?{
                        title: u.prefix,
                        suffix: u.suffix,
                        name: u.name,
                        company: u.firm,
                        id: u._id,
                        code: theReg?(theReg.regCode+'-'+ theReg.conferenceFee):''
                    }:theReg?{
                        title: theReg.prefix,
                        suffix: theReg.suffix,
                        name: theReg.firstName+' '+ (!theReg.middleName.length?'':(theReg.middleName.substring(0,1)+'. '))+ theReg.surname,
                        company: theReg.registrationType!='judge'&&theReg.registrationType!='magistrate'?theReg.company:(theReg.court+' '+theReg.state+' '+theReg.division),
                        id: u._id,
                        code: theReg.regCode+'-'+ theReg.conferenceFee
                    }:{}));
                });

                User.update({_id: {$in: req.query.tags}}, {'$set': {tagPrinted:true}}, {multi:true}, function() { return; });

                return sendData(response);
            });
        }
    });
};

// Get list of users
exports.index = function(req, res) {
    if (req.query.unregistered) {
        Registration.find({ completed: true, isGroup:false }).select('email').exec(function(err, registered){
            var mArr = _.uniq(_.map(registered, function(r){ return r.email.toLowerCase(); }));

            User.find({email: { $nin: mArr, $regex: new RegExp('@', 'i') }, accountType: "single" }).sort('lastModified').select('email lastModified _id').exec(function(err, users) {
                res.json(users);

            });
        });
    } else {
        if (req.query.name) {
            var term = new RegExp(req.query.name, 'i');
            User.find({$and: [
                { $or: [{ email: {$regex:term} }, { name: {$regex:term} }, { bag: {$regex:term} }, { firm: {$regex:term} }, { phone: {$regex:term} }] },
                { tagPrinted: req.query.tagPrinted, accountType: 'single' }
            ]}, '_id email', function (err, users) {
                if(err) { return handleError(res, err); }
                // Return Only Users with Confirmed Registration Data
                var userIds = _.pluck(users, '_id');

                Registration.find({user:{$in: userIds}, paymentSuccessful:true, statusConfirmed:true}).select('_id, user')
                .populate('user').exec(function(err, registrations){
                    var _toReturn = _.pluck(registrations, 'user');
                    return res.json(_toReturn);
                });
            });
        } else {
            User.find(req.query, function (err, users) {
                if(err) { return handleError(res, err); }

                if(err) { return handleError(res, err); }
                // Return Only Users with Confirmed Registration Data
                var userIds = _.pluck(users, '_id');

                Registration.find({user:{$in: userIds}, paymentSuccessful:true, statusConfirmed:true}).select('_id, user')
                    .populate('user').exec(function(err, registrations){
                        var _toReturn = _.pluck(registrations, 'user');
                        return res.json(_toReturn);
                    });
            });
        }
    }
};

exports.reset = function(req, res) {

    User.findById(req.params.id, '+password', function(err, existingUser) {

        existingUser.password = existingUser.generateHash('1234');
        existingUser.save(function() {
            delete existingUser.password;
            res.json(existingUser);

        });
    });
};

// Get a single user
exports.show = function(req, res) {
  User.findById(req.params.id, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(user);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}