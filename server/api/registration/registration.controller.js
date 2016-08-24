'use strict';

var _ = require('lodash');
var Registration = require('./registration.model'),
    OfflineReg = require('./offlineReg.model'),
    OfflineGroup = require('../user/offlineGroup.model'),
    User = require('../user/user.model'),
    OfflineUser = require('../user/offlineUser.model'),
    Invoice = require('../invoice/invoice.model'),
    Bag = require('../bag/bag.model'),
    Sponsor = require('../sponsor/sponsor.model'),
    mailer = require('../../components/tools/mailer'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    csv = require('express-csv'),
    Access = require('./access.model'),
    moment = require('moment'),
    Async = require('async'),
    Branch = require('../branch/branch.model');

var ObjectId = require('mongoose').Types.ObjectId;
var qr = require('qr-image');

function postPay(orderID, amount, callback) {

    request('https://cipg.accessbankplc.com/MerchantServices/TransactionStatusCheck.ashx?MERCHANT_ID=09948&ORDER_ID=' + orderID + '&CURR_CODE=566&AMOUNT=' + amount, function (error, response, body) {

        callback(error, response, body);

    });
}

exports.namesByBranch = function (req, res) {
    Registration.distinct('branch', {statusConfirmed: true, paymentSuccessful: true}, function (err, records) {
        res.json(records);
    });
};

exports.groupReport = function (req, res) {
    //Registration.find({"statusConfirmed":true, "paymentSuccessful":true, $or: [ {"branch":/unity/i} ] })
    Registration.find({"statusConfirmed": true, "paymentSuccessful": true, $or: [{"branch": /lagos/i}, {"branch": /ikeja/i}, {"branch": /island/i}]})

    //Registration.find({"statusConfirmed":true, "paymentSuccessful":true})
    //.select('firstName middleName surname regCode registrationType yearCalled user -_id')
        .select('firstName middleName surname branch user -_id')
        .sort({surname: 1})
        .populate('user', 'bag fastTracked -_id')
        .exec(function (err, records) {
            console.log('%s records found!', records.length);
            var toReturn = [];
            _.each(records, function (r) {
                toReturn.push({
                    surname: r.surname.toUpperCase(),
                    firstName: r.firstName.toUpperCase(),
                    middleName: r.middleName.toUpperCase(),
                    branch: r.branch.toUpperCase(),
                    //regCode: r.regCode.toUpperCase(),
                    //registrationType: r.registrationType,
                    //yearCalled: r.yearCalled,
                    bag: r.user ? r.user.bag : "",
                    collected: r.user ? (r.user.fastTracked ? "YES" : "NO") : "NO"
                });
            });

            toReturn = _.sortBy(toReturn, 'surname');

            return res.csv(toReturn);
        });
};

exports.withTags = function (req, res) {
    var term = new RegExp(req.query.name, 'i');
    var page = (req.query.page || 1) - 1,
        perPage = req.query.perPage || 25;

    Registration.count({
        $and: [
            {
                $or: [{email: {$regex: term}}, {surname: {$regex: term}}, {firstName: {$regex: term}}, {middleName: {$regex: term}}, {registrationCode: {$regex: term}}],
                tagPrinted: true
            }
        ]
    }, function (err, total) {
        Registration.find({
            $and: [
                {
                    $or: [{email: {$regex: term}}, {surname: {$regex: term}}, {firstName: {$regex: term}}, {middleName: {$regex: term}}, {registrationCode: {$regex: term}}],
                    tagPrinted: true
                }
            ]
        }, 'prefix suffix surname firstName middleName branch registrationCode')
            .sort('registrationCode')
            .skip(page * perPage)
            .limit(perPage)
            .exec(function (err, registrations) {
                res.header('total_found', total);
                return res.json(registrations);
            });
    });

};

exports.qrCode = function (req, res) {
    var params = {_id: new ObjectId(req.query.me), paymentSuccessful: true, statusConfirmed: true};
    //var params = { user: new ObjectId(req.query.me), paymentSuccessful: true, statusConfirmed: true };
    Registration.findOne(params, function (err, reg) {
        if (err) {
            return handleError(res, err);
        }
        if (!reg) {
            return res.send(404);
        }

        // var company = reg.registrationType!='judge'&&reg.registrationType!='magistrate'?reg.company:(reg.court+' '+reg.state+' '+reg.division);

        var theData = 'BEGIN:VCARD\nVERSION:3.0\nN:' + reg.surname + ';' + reg.firstName + ';' + reg.middleName + ';;\nFN:' + (reg.firstName + ' ' + reg.surname + ' ' + reg.suffix) + '\nORG:' + reg.branch + ' BRANCH\nTITLE:' + reg.suffix + '\nEMAIL;type=INTERNET;type=WORK;type=pref:' + reg.email + '\nTEL;type=MOBILE;type=pref:' + reg.mobile + '\nEND:VCARD',
            code = qr.image(theData, {type: 'svg'});
        res.type('svg');
        code.pipe(res);
    });
};

exports.qrCodeInstant = function (req, res) {
    var branch = req.query.branch;

    var theData = 'BEGIN:VCARD\nVERSION:3.0\nN:' + req.query.surname + ';' + req.query.firstName + ';;\nFN:' + (req.query.firstName + ' ' + req.query.surname) + '\nORG:\nTITLE:\nEMAIL;type=INTERNET;type=WORK;type=pref:' + req.query.email + '\nTEL;type=MOBILE;type=pref:' + req.query.phone + '\nEND:VCARD',
        code = qr.image(theData, {type: 'svg'});
    res.type('svg');
    code.pipe(res);
};

exports.querySwitch = function (a, b, c) {
    return postPay(a, b, c);
};

exports.fastTrack = function (req, res) {
    var n_sn = new RegExp(req.query.q, 'i');

    Registration.find()
        .and([
            {$or: [{email: {$regex: n_sn}}, {mobile: {$regex: n_sn}}, {firstName: {$regex: n_sn}}, {surname: {$regex: n_sn}}, {middleName: {$regex: n_sn}}, {regCode: {$regex: n_sn}},{registrationCode: {$regex: n_sn}}]},
            {paymentSuccessful: true, statusConfirmed: true, responseGotten: true}
        ])
        .populate('user').populate('user._doneBy_').exec(function (err, registrations) {
        if (err) return handleError(res, err);
        return res.json(registrations);

    });
};


//finalize delegates by dapo
exports.finalizeDelegate = function (req, res) {

    function decreaseBag(res, bag, registration) {

        Bag.update({name: bag}, {$inc: {quantity: -1}}, function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(registration);
        });

    }

    Registration.findById(req.params.id).populate('user').populate('user._doneBy_').exec(function (err, registration) {
        if (err) return handleError(res, err);

        User.findById(registration.user, function (err, user) {
            if (err) return handleError(res, err);

            user.fastTracked = true;
            user.fastTrackTime = new Date();
            user._doneBy_ = req.user;

            var doBagUpdate = false;

            if (user.bag == '') {
                doBagUpdate = true;
                user.bag = req.body.user.bag;
            }

            user.save(function () {
                if (doBagUpdate) {
                    return decreaseBag(res, user.bag, registration);
                }

                return res.status(200).json(registration);
            });
        });
    });
};


exports.stats = function (req, res) {
    var ret = {};
    Registration.count({paymentSuccessful: true, statusConfirmed: true, responseGotten: true}, function (err, count) {
        ret.confirmed = count;

        Registration.count({paymentSuccessful: true, statusConfirmed: true, responseGotten: true, isGroup: true}, function (err, count) {
            ret.confirmedDelegates = count;
            ret.confirmedIndividuals = ret.confirmed - count;

            Registration.count({paymentSuccessful: false, webpay: false, responseGotten: false}, function (err, count) {
                ret.pendingDirect = count;

                Registration.count({fastTracked: true}, function (err, count) {
                    ret.fastTracked = count;

                    Registration.count({tagPrinted: true}, function (err, count) {
                        ret.tagPrinted = count;

                        // Fast Tracked Today
                        var d = new Date(), month = d.getMonth(), year = d.getFullYear(), day = d.getDate();

                        Registration.count({fastTrackTime: {$gt: new Date(year + ',' + (month + 1) + ',' + day)}}, function (err, count) {
                            ret.fastTrackedToday = count;

                            Access.count({resolved: false, dataType: 'online', deleted: {$ne: true}}, function (err, count) {
                                ret.accessDataOnline = count;

                                Access.count({resolved: false, dataType: 'offline', deleted: {$ne: true}}, function (err, count) {
                                    ret.accessDataOffline = count;
                                  Branch.count({fastTracked: true}, function (err, count) {
                                    ret.branchFastTracked = count;
                                    return res.json(ret);
                                  });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
};

// Get list of registrations
exports.index = function (req, res) {
    var n_sn = new RegExp(req.query.term, 'i');
    delete req.query.term;
  if(req.query.pending){
    delete  req.query.pending;
    Registration.find()
      .and([
        {$or: [{email: {$regex: n_sn}}, {mobile: {$regex: n_sn}}, {firstName: {$regex: n_sn}}, {surname: {$regex: n_sn}}, {middleName: {$regex: n_sn}}, {regCode: {$regex: n_sn}}, {registrationCode: {$regex: n_sn}}]},
        req.query
      ]).select('prefix firstName surname middleName email mobile regCode conferenceFee webpay lastModified suffix paymentSuccessful bankDeposit bankpay').exec(function (err, registrations) {
      if (err) return handleError(res, err);
      return res.json(registrations);
    });
  }
  else{
    Registration.find()
      .and([
        {$or: [{email: {$regex: n_sn}}, {mobile: {$regex: n_sn}}, {firstName: {$regex: n_sn}}, {surname: {$regex: n_sn}}, {middleName: {$regex: n_sn}}, {regCode: {$regex: n_sn}}, {registrationCode: {$regex: n_sn}}]},
        req.query
      ]).exec(function (err, registrations) {
      if (err) return handleError(res, err);
      return res.json(registrations);
    });
  }
};

exports.fast = function (req, res) {
  var regex = new RegExp('.*vip*.','i');
  if (req.query.vip =='false'){
    req.query.registrationCode = {$not:regex};
    delete req.query.vip;
  }
  if (req.query.vip =='true'){
    req.query.registrationCode = regex;
    delete req.query.vip;
  }

  if (req.query.isGroup == 'true'){
    Registration.find(req.query).populate('owner', 'groupName email phone').select('prefix suffix email conferenceFee mobile registrationCode firstName surname owner branch fastTracked fastTrackTime').exec(function (err, registrations) {
      if (err) return handleError(res, err);
      return res.json(registrations);
    });
  }else{
    Registration.find(req.query).exec(function (err, registrations) {
      if (err) return handleError(res, err);
      return res.json(registrations);
    });
  }
};

// Get a single registration
exports.show = function (req, res) {
    Registration.findById(req.params.id, function (err, registration) {
        if (err) {
            return handleError(res, err);
        }
        if (!registration) {
            return res.send(404);
        }
        return res.json(registration);
    });
};

// Creates a new registration in the DB.
exports.create = function (req, res) {

    if (req.body.isDirect || (req.body.sponsor && req.body.sponsor.length)) {
        req.body.regCode = Registration.pRef(5);
    }

    Registration.create(req.body, function (err, registration) {

        if (err) {
            return handleError(res, err);
        }

        if (registration.conferenceFee <= Number(registration.bankDeposit)) {

            if (req.body.sponsor != undefined) {
                //Add registration to sponsors
                Sponsor.findById(registration.sponsor, function (err, sponsor) {
                    sponsor._delegates.push(registration);
                    sponsor.save(function () {
                        // Create Account
                        // Create User Account Using First Name and Last Name as Username
                        var username = (registration.firstName + registration.surname).split(' ').join('').toLowerCase();

                        // Find Existing User
                        User.find({email: username}, function (err, existingUsers) {

                            if (existingUsers.length) {
                                username += '_' + existingUsers.length;
                            }

                            var newPass = '123456';

                            var user = new User();
                            user.email = username;
                            user.password = user.generateHash(newPass);

                            user.save(function () {

                                registration.user = user;
                                registration.accountCreated = true;

                                registration.save(function (err) {

                                    if (err) {
                                        return handleError(res, err);
                                    }

                                    // Send Email to the User Here
                                    mailer.sendWelcomeMailWithUsername(registration, newPass, username, function (err) {
                                        if (err !== null) {
                                            return handleError(res, err);
                                        }

                                        // Send the text message
                                        mailer.sendRegistrationTextWithUsername(registration, newPass, username, function (err) {

                                            if (err !== null) {
                                                return handleError(res, err);
                                            }

                                            return res.status(201).json(registration);
                                        });

                                    });

                                });

                            });
                        });
                    });
                });
            } else {

                registration.responseGotten = true;
                registration.paymentSuccessful = true;
                registration.statusConfirmed = true;

                registration.save(function (err) {
                    if (err) {
                        return handleError(res, err);
                    }

                    return res.status(201).json(registration);
                });
            }
        } else {
            return res.status(201).json(registration);
        }
    });
};

// Updates an existing registration in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Registration.findById(req.params.id, function (err, registration) {
        if (err) {
            return handleError(res, err);
        }
        if (!registration) {
            return res.send(404);
        }
        var updated = _.merge(registration, req.body);
        if (registration.paymentSuccessful == false){
          if (updated.conferenceFee <= Number(updated.bankDeposit)) {
            updated.responseGotten = true;
            updated.paymentSuccessful = true;
            updated.statusConfirmed = true;
          }
          else {
            updated.responseGotten = true;
            updated.paymentSuccessful = false;
            updated.statusConfirmed = false;
          }
        }

        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.json(200, registration);
        });
    });
};

// Deletes a registration from the DB.
exports.destroy = function (req, res) {
    Registration.findById(req.params.id, function (err, registration) {
        if (err) {
            return handleError(res, err);
        }
        if (!registration) {
            return res.send(404);
        }
        registration.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.send(204);
        });
    });
};

exports.check = function (req, res) {

    if (!req.query.code) {
        if (req.query.email == undefined) {
            return res.send({status: false});
        }
        req.query.email.trim();
        var n_sn = new RegExp(req.query.email, 'i');
        Registration.findOne({$or: [{email: {$regex: n_sn}}, {PaymentRef: req.query.PaymentRef}]}).sort('-lastModified').select('_id' +
            ' email paymentSuccessful')
            .exec(function (err, result) {
                if (err) {
                    return handleError(res, err);
                }
                if (result) {
                    return res.send(200, {status: true, _id: result._id, paymentStatus: result.paymentSuccessful})
                }

                return res.send({status: false, paymentStatus: false});
            });
    }
    if (req.query.code) {
        var code = new RegExp(req.query.code, 'i');
        Registration.findOne({regCode: {$regex: code}}).sort('-lastModified').select('_id email' +
            ' paymentSuccessful')
            .exec(function (err, result) {
                if (err) {
                    return handleError(res, err);
                }
                if (result) {
                    return res.send(200, {status: true, _id: result._id, paymentStatus: result.paymentSuccessful})
                }
                else {
                    return res.send({status: false, paymentSuccessful: false});
                }
            });
    }
};

// Create an offline registration
exports.createOfflineReg = function (req, res) {

    // Declare User to store on User's collection
    var user = {
        accountType: 'single',
        email: req.body.email,
        phone: req.body.phone,
        fastTracked: true,
        _doneBy_: req.user,
        _staff_: req.user,
        fastTrackTime: Date.now()
    };

    OfflineUser.create(user, function (err, newUser) {
        if (err) {
            return handleError(res, err);
        }

        delete req.body.groupName;
        req.body.user = newUser._id;
        OfflineReg.create(req.body, function (err, offlineReg) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(201).json(offlineReg);
        });
    });
};

// Create an offline registration for Group Admin
exports.createGroupAdminOfflineReg = function (req, res) {
    OfflineUser.find({accoutType: 'group', groupName: req.body.group}, function (err, found) {
        if (err) { return handleError(res, err); }

        //  Only save if no duplicate Admin
        if (!found) {

            // Declare User to store on User's collection
            var user = {
                accountType: 'group',
                email: req.body.email,
                phone: req.body.phone,
                groupName : req.body.group,
                fastTracked: true,
                _doneBy_: req.user,
                fastTrackTime: Date.now()
            };

            OfflineUser.create(user, function (err, newUser) {
                if (err) {
                    return handleError(res, err);
                }

                delete req.body.owner;
                req.body.user = newUser._id;
                req.body.fastTracked = true;
                req.body.isGroup = true;
                OfflineReg.create(req.body, function (err, offlineReg) {
                    if (err) {
                        return handleError(res, err);
                    }
                    return res.status(201).json(offlineReg);
                });
            });
        }
        return res.status(409).json({message : 'Group Admin already exists for this Group'});
    })

};

// Create an offline registration for a group member
exports.createGroupMemberOfflineReg = function (req, res) {

    // Declare User to store on User's collection
    var user = {
        accountType: 'single',
        email: req.body.email,
        phone: req.body.phone,
        fastTracked: true,
        _doneBy_: req.user,
        fastTrackTime: Date.now()
    };

    OfflineUser.create(user, function (err, newUser) {
        if (err) {
            return handleError(res, err);
        }

        delete req.body.groupName;
        req.body.user = newUser._id;
        req.body.isGroup = true;
        req.body.fastTracked = true;
        OfflineReg.create(req.body, function (err, offlineReg) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(201).json(offlineReg);
        });
    });
};

// Add a new offline group used for offline registrations
exports.addGroup = function (req, res) {
    if (typeof req.body.groupName === 'undefined' || req.body.groupName === '') {
        return res.status(406).json({message : 'Group cannot be empty!'});
    }

    OfflineGroup.create(req.body, function (err, group) {
        if (err) { return handleError(res, err); }
        OfflineGroup.find({}, function (err, allGroups) {
            if (err) { return handleError(res, err); }
            return res.status(200).json(allGroups);
        });
    });

/*    var groupName = new RegExp(req.body.groupName, 'i');
    OfflineGroup.find({groupName : groupName}, function (err, found) {
        // console.log(found);
        if (err) { return handleError(res, err); }
        if (found.length == 0) {
            OfflineGroup.create(req.body, function (err, group) {
                if (err) { return handleError(res, err); }
                OfflineGroup.find({}, function (err, allGroups) {
                    if (err) { return handleError(res, err); }
                    return res.status(200).json(allGroups);
                });
            });
        }
        return res.status(409).json({message : 'Group exists already'});
    });*/
};

// Get all groups to populate group select box
exports.allGroups = function (req, res) {
    OfflineGroup.find({}, function (err, allGroups) {
        if (err) { return handleError(res, err); }
        res.send(allGroups);
    });
};

//send collection of materials to branch
exports.branchFastTracked = function (req,res) {
  req.query.Time = moment().format('lll');
  Async.series([function (callback) {
    _.each(req.body,function (reg) {
      //TODO: add sending collection of material to phone number
      mailer.sendBranchCollected(req.query,reg);
    });
    callback();
  }],function (err) {
    if (err)
    {
      return next(err);
    }
    Branch.update({_id: req.query.id}, { $set: { fastTrackTime: req.query.Time,fastTracked:true} }, function(){
      return res.status(200).json({message:'Collection Message has been sent to Branch members Successfully'});
    });

  });

};

//send collection of material to individual
exports.individualFastTracked = function (req,res) {
  req.body.fastTrackTime = new Date;
  Async.series([function (callback) {
     mailer.sendIndividualCollected(req.body);
    callback();
  }],function (err) {
    if (err)
    {
      return next(err);
    }
    Registration.update({_id: req.query.id},{ $set: { fastTrackTime: req.body.fastTrackTime,fastTracked:true}
  },function () {
      return res.status(200).json({message:'FastTrack Message has been sent to Delegate Successfully',fasTtrackTime:req.body.fastTrackTime});
    });
  });

};


function handleError(res, err) {
    console.error(err);
    return res.send(500, err);
}
