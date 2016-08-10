'use strict';

var _ = require('lodash');
var User = require('./user.model');
var Registration = require('../registration/registration.model');
var Invoice = require('../invoice/invoice.model');

var ObjectId = require('mongoose').Types.ObjectId;

// Get User Tags for Printing
exports.getTags = function (req, res) {

    var sendData = function (response) {
        return res.json(response);
    };

    if (typeof req.query.tags == "string") {
        req.query.tags = [req.query.tags];
    }

    // Get Users
    User.find({_id: {$in: req.query.tags}}, function (err, usersWithTags) {

        var response = [];

        if (typeof req.query.tags == "string") {

            console.log('Doing...Single');
            // Get Registration Info
            Registration.findOne({user: new ObjectId(req.query.tags)}, function (err, reg) {

                var u = usersWithTags[0];

                response.push((u.hasTag ? {
                    prefix: u.prefix,
                    suffix: u.suffix,
                    name: u.name,
                    company: u.firm,
                    id: u._id,
                    code: reg.registrationCode
                    // code: reg?(reg.registrationCode):''
                } : reg ? {
                    prefix: reg.prefix,
                    suffix: reg.suffix,
                    name: reg.firstName + ' ' + (!reg.middleName.length ? '' : (reg.middleName.substring(0, 1) + '. ')) + reg.surname,
                    company: reg.registrationType != 'judge' && reg.registrationType != 'magistrate' ? reg.company : (reg.court + ' ' + reg.state + ' ' + reg.division),
                    id: u._id,
                    code: reg.registrationCode
                } : {}));

                User.update({_id: {$in: req.query.tags}}, {'$set': {tagPrinted: true, lastModified: new Date()}}, function () {
                    return;
                });

                return sendData(response);

            });
        } else {
            // Get Registration Info
            Registration.find({user: {$in: req.query.tags}}, function (err, regs) {

                _.each(usersWithTags, function (u) {
                    var theReg = _.find(regs, {'user': u._id});
                    //var theReg = _.find(regs, function(r) { console.log('%s == %s', r.user, u._id); return r.user== u._id; });
                    if (u.name) {
                        var name_split = u.name.split(' ');
                    }
                    response.push((u.hasTag ? {
                        // prefix: u.prefix,
                        // suffix: u.suffix,
                        // surname: name_split[0],
                        // firstName: name_split.length>2?name_split[name_split.length-1]:name_split[1],
                        // middleName: name_split.length>2?name_split[1]:'',
                        // branch: theReg.branch,
                        // // name: u.name,
                        // // company: u.firm,
                        // id: u._id,
                        // code: u?(u.registrationCode):''
                        prefix: theReg.prefix,
                        suffix: theReg.suffix,
                        surname: theReg.surname,
                        firstName: theReg.firstName,
                        middleName: theReg.middleName,
                        branch: theReg.branch,
                        // name: theReg.firstName+' '+ (!theReg.middleName.length?'':(theReg.middleName.substring(0,1)+'. '))+ theReg.surname,
                        // company: theReg.registrationType!='judge'&&theReg.registrationType!='magistrate'?theReg.company:(theReg.court+' '+theReg.state+' '+theReg.division),
                        id: u._id,
                        code: theReg.registrationCode
                    } : theReg ? {
                        prefix: theReg.prefix,
                        suffix: theReg.suffix,
                        surname: theReg.surname,
                        firstName: theReg.firstName,
                        middleName: theReg.middleName,
                        branch: theReg.branch,
                        // name: theReg.firstName+' '+ (!theReg.middleName.length?'':(theReg.middleName.substring(0,1)+'. '))+ theReg.surname,
                        // company: theReg.registrationType!='judge'&&theReg.registrationType!='magistrate'?theReg.company:(theReg.court+' '+theReg.state+' '+theReg.division),
                        id: u._id,
                        code: theReg.registrationCode
                    } : {}));
                });

                User.update({_id: {$in: req.query.tags}}, {'$set': {tagPrinted: true}}, {multi: true}, function () {
                    return;
                });

                return sendData(response);
            });
        }
    });
};

// Get list of users
exports.index = function (req, res) {
    if (req.query.unregistered) {
        Registration.find({completed: true, isGroup: false}).select('email').exec(function (err, registered) {
            var mArr = _.uniq(_.map(registered, function (r) {
                return r.email.toLowerCase();
            }));

            User.find({email: {$nin: mArr, $regex: new RegExp('@', 'i')}, accountType: "single"}).sort('lastModified').select('email lastModified _id').exec(function (err, users) {
                res.json(users);

            });
        });
    } else {
        if (req.query.name) {
            var term = new RegExp(req.query.name, 'i');
            User.find({
                $and: [
                    {$or: [{email: {$regex: term}}, {name: {$regex: term}}, {bag: {$regex: term}}, {firm: {$regex: term}}, {phone: {$regex: term}}]},
                    {tagPrinted: req.query.tagPrinted, accountType: 'single'}
                ]
            }, '_id email', function (err, users) {
                if (err) {
                    return handleError(res, err);
                }
                // Return Only Users with Confirmed Registration Data
                var userIds = _.pluck(users, '_id');

                Registration.find({user: {$in: userIds}, paymentSuccessful: true, statusConfirmed: true}).select('_id, user')
                    .populate('user').exec(function (err, registrations) {
                    var _toReturn = _.pluck(registrations, 'user');
                    return res.json(_toReturn);
                });
            });
        } else if (req.query.page || req.query.perPage) {
            var page = (req.query.page || 1) - 1,
                perPage = req.query.perPage || 25;
            User.find({}).exec(function (err, users) {
                if (err) {
                    return handleError(res, err);
                }

                if (err) {
                    return handleError(res, err);
                }
                // Return Only Users with Confirmed Registration Data
                var userIds = _.pluck(users, '_id');

                Registration.count({user: {$in: userIds}, paymentSuccessful: true, statusConfirmed: true}, function (e, total) {
                    Registration.find({
                        user: {$in: userIds},
                        paymentSuccessful: true,
                        statusConfirmed: true
                    }).select('_id prefix suffix surname middleName branch firstName registrationCode user')
                        .populate('user')
                        .sort('branch')
                        .skip(page * perPage)
                        .limit(perPage)
                        .exec(function (err, registrations) {
                            var _toReturn = _.pluck(registrations, 'user');
                            res.header('total_found', total);
                            return res.json(registrations);
                        });
                });
            });

        } else {
            User.find(req.query, function (err, users) {
                if (err) {
                    return handleError(res, err);
                }

                if (err) {
                    return handleError(res, err);
                }
                // Return Only Users with Confirmed Registration Data
                var userIds = _.pluck(users, '_id');

                Registration.find({user: {$in: userIds}, paymentSuccessful: true, statusConfirmed: true}).select('_id, surname, middleName, firstName, user')
                    .populate('user').exec(function (err, registrations) {
                    var _toReturn = _.pluck(registrations, 'user');
                    return res.json(_toReturn);
                });
            });
        }
    }
};

// ---
exports.reset = function (req, res) {

    User.findById(req.params.id, '+password', function (err, existingUser) {

        existingUser.password = existingUser.generateHash('1234');
        existingUser.save(function () {
            delete existingUser.password;
            res.json(existingUser);

        });
    });
};

// Get a single user
exports.show = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return handleError(res, err);
        }
        if (!user) {
            return res.send(404);
        }
        return res.json(user);
    });
};

//get manually created Groups
exports.getGroups = function (req, res) {
    User.find(req.query, function (err, user) {
        if (err) {
            return handleError(res, err);
        }
        if (!user) {
            return res.send(404);
        }
        return res.json(user);
    });
};

// Creates a new user in the DB.
exports.create = function (req, res) {
    var email = new RegExp(req.body.email, 'i');
    User.findOne({email: email}, function (err, foundUser) {
        if (foundUser) {
            return res.json(200, {message: 'Email is already Taken Please Try Another Email.'})
        }
        var user = new User();

        user.email = req.body.email;
        user.groupName = req.body.groupName;
        user.password = user.generateHash(req.body.password);
        user.phone = req.body.phone;
        user.accountType = 'group';
        user.isDirect = true;

        user.save(function (err, user) {
            delete user.password;
            return res.json(200, user);

        });

    });

};

// Get list of users for NAMETAG printing
exports.allUsersForNameTags = function (req, res) {
    if (req.query.page || req.query.perPage) {
        var page = (req.query.page || 1) - 1,
            perPage = req.query.perPage || 25;

        Registration.count({paymentSuccessful: true, statusConfirmed: true}, function (e, total) {
            Registration.find({
                // user: {$in: userIds},
                paymentSuccessful: true,
                statusConfirmed: true
            }).select('_id prefix suffix surname middleName branch firstName registrationCode tagPrinted user')
                .populate('user')
                .sort('registrationCode')
                .skip(page * perPage)
                .limit(perPage)
                .exec(function (err, registrations) {
                    var _toReturn = _.pluck(registrations, 'user');
                    res.header('total_found', total);
                    return res.json(registrations);
                });
        });

    } else {

    }
};

// Get Registration Tags for Printing
exports.getRegistrationTags = function (req, res) {

    var sendData = function (response) {
        return res.json(response);
    };

    if (typeof req.query.tags == "string") {
        req.query.tags = [req.query.tags];
    }

    // Get Registrations
    Registration.find({_id: {$in: req.query.tags}}, 'prefix suffix surname firstName middleNmae branch registrationCode', function (err, regs) {

        Registration.update({_id: {$in: req.query.tags}}, {'$set': {tagPrinted: true}}, {multi: true}, function () {
            return;
        });

        return sendData(regs);
    });
};

function handleError(res, err) {
    return res.send(500, err);
}
