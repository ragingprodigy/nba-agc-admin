'use strict';

var _ = require('lodash');
var Registration = require('./registration.model'),
    User = require('../user/user.model'),
    Invoice = require('../invoice/invoice.model'),
    Bag = require('../bag/bag.model'),
    Sponsor = require('../sponsor/sponsor.model'),
    mailer = require('../../components/tools/mailer'),
    request = require('request'),
    parseString = require('xml2js').parseString,
    csv = require('express-csv');

var ObjectId = require('mongoose').Types.ObjectId;
var qr = require('qr-image');

function postPay (orderID, amount, callback) {

    request('https://cipg.accessbankplc.com/MerchantServices/TransactionStatusCheck.ashx?MERCHANT_ID=09948&ORDER_ID=' + orderID + '&CURR_CODE=566&AMOUNT=' + amount , function (error, response, body) {

        callback(error, response, body);

    });
}

exports.namesByBranch = function(req, res){
    Registration.distinct('branch', {statusConfirmed:true, paymentSuccessful:true}, function(err, records){
        res.json(records);
    });
};

exports.groupReport = function(req, res) {
    //Registration.find({"statusConfirmed":true, "paymentSuccessful":true, $or: [ {"branch":/unity/i} ] })
    Registration.find({"statusConfirmed":true, "paymentSuccessful":true, $or: [ {"branch":/lagos/i}, {"branch":/ikeja/i}, {"branch":/island/i} ] })

    //Registration.find({"statusConfirmed":true, "paymentSuccessful":true})
    //.select('firstName middleName surname regCode registrationType yearCalled user -_id')
    .select('firstName middleName surname branch user -_id')
    .sort({surname:1})
    .populate('user', 'bag fastTracked -_id')
    .exec(function(err, records) {
            console.log('%s records found!', records.length);
        var toReturn = [];
        _.each(records, function(r){
            toReturn.push({
                surname: r.surname.toUpperCase(),
                firstName: r.firstName.toUpperCase(),
                middleName: r.middleName.toUpperCase(),
                branch: r.branch.toUpperCase(),
                //regCode: r.regCode.toUpperCase(),
                //registrationType: r.registrationType,
                //yearCalled: r.yearCalled,
                bag: r.user? r.user.bag:"",
                collected: r.user? (r.user.fastTracked?"YES":"NO"):"NO"
            });
        });

       toReturn = _.sortBy(toReturn, 'surname');

        return res.csv(toReturn);
    });
};

exports.withTags = function(req, res) {
    var term = new RegExp(req.query.name, 'i');
    Registration.find({$and: [
        { $or: [{ email: {$regex:term} }, { surname: {$regex:term} }, { firstName: {$regex:term} }, { middleName: {$regex:term} }, { regCode: {$regex:term} }] }
    ]})
    .populate({
        'path':'user',
        'match': {tagPrinted:true}
    })
    .exec(function(err, registrations){
        //var _toReturn = _.pluck(registrations, 'user');
        var _toReturn = _.filter(registrations, function(r) { return r.user != null });
        return res.json(_toReturn);
    });
};

exports.qrCode = function(req, res) {
    var params = { user: new ObjectId(req.query.me), paymentSuccessful: true, statusConfirmed: true };
    //var params = { user: new ObjectId(req.query.me), paymentSuccessful: true, statusConfirmed: true };
    Registration.findOne(params, function (err, reg) {
        if(err) { return handleError(res, err); }
        if (!reg) { return res.send(404); }

        var company = reg.registrationType!='judge'&&reg.registrationType!='magistrate'?reg.company:(reg.court+' '+reg.state+' '+reg.division);

        var theData = 'BEGIN:VCARD\nVERSION:3.0\nN:'+reg.surname+';'+reg.firstName+';'+reg.middleName+';;\nFN:'+(reg.firstName+' '+reg.surname+' '+reg.suffix)+'\nORG:'+company+'\nTITLE:'+reg.suffix+'\nEMAIL;type=INTERNET;type=WORK;type=pref:'+reg.email+'\nTEL;type=MOBILE;type=pref:'+reg.mobile+'\nEND:VCARD',
            code = qr.image(theData, { type: 'svg' });
        res.type('svg');
        code.pipe(res);
    });
};

exports.qrCodeInstant = function(req, res) {
    var company = req.query.company;

    var theData = 'BEGIN:VCARD\nVERSION:3.0\nN:'+req.query.name+';;\nFN:'+(req.query.name)+'\nORG:'+company+'\nTITLE:\nEMAIL;type=INTERNET;type=WORK;type=pref:'+req.query.email+'\nTEL;type=MOBILE;type=pref:'+req.query.phone+'\nEND:VCARD',
        code = qr.image(theData, { type: 'svg' });
    res.type('svg');
    code.pipe(res);
};

exports.querySwitch = function(a, b, c){
    return postPay(a, b, c);
};

exports.fastTrack = function(req, res) {
    var n_sn = new RegExp(req.query.q, 'i');

    Registration.find()
    .and([
        { $or: [ { email: { $regex: n_sn }}, { mobile: { $regex: n_sn }}, { firstName: { $regex: n_sn }}, { surname: { $regex: n_sn }}, { middleName: { $regex: n_sn }}, { regCode: { $regex: n_sn }} ] },
        { paymentSuccessful: true, statusConfirmed: true, responseGotten: true }
    ])
    .populate('user').populate('user._doneBy_').exec(function(err, registrations) {
        if (err) return handleError(res, err);
        return res.json(registrations);
    });
};

exports.finalizeDelegate = function(req, res) {

    function decreaseBag(res, bag, registration) {

        Bag.update({ name: bag }, { $inc: { quantity: -1 } }, function(err) {
            if (err) { return handleError(res, err); }
            return res.json(registration);
        });

    }

    Registration.findById(req.params.id).populate('user').populate('user._doneBy_').exec(function(err, registration){
        if (err) return handleError(res, err);

        User.findById(registration.user, function(err, user){
            if (err) return handleError(res, err);

            user.fastTracked = true;
            user.fastTrackTime = new Date();
            user._doneBy_ = req.user;

            var doBagUpdate = false;

            if (user.bag=='') {
                doBagUpdate = true;
                user.bag = req.body.user.bag;
            }

            user.save(function(){
                if (doBagUpdate) { return decreaseBag(res, user.bag, registration); }

                return res.status(200).json(registration);
            });
        });
    });
};

exports.stats = function(req, res) {
    var ret = {};
    Registration.count({ paymentSuccessful: true, statusConfirmed: true, responseGotten: true }, function(err, count){
        ret.confirmed = count;

        Registration.count({ paymentSuccessful: true, statusConfirmed: true, responseGotten: true, isGroup:true }, function(err, count){
            ret.confirmedDelegates = count;
            ret.confirmedIndividuals = ret.confirmed - count;

            Registration.count({ paymentSuccessful: true, statusConfirmed: true, responseGotten: true, isGroup:true }, function(err, count){
                ret.pendingDirect = count;

                User.count({fastTracked:true}, function(err, count){
                    ret.fastTracked = count;

                    User.count({tagPrinted:true}, function(err, count){
                        ret.tagPrinted = count;

                        // Fast Tracked Today
                        var d = new Date(), month = d.getMonth(), year = d.getFullYear(), day = d.getDate();

                        User.count({ fastTrackTime: { $gt: new Date(year+','+(month+1)+','+day) }}, function(err, count){
                            ret.fastTrackedToday = count;
                            return res.json(ret);
                        });
                    });
                });
            });
        });
    });
};

// Get list of registrations
exports.index = function(req, res) {
    var n_sn = new RegExp(req.query.term, 'i');
    delete req.query.term;

    Registration.find()
    .and([
        { $or: [ { email: { $regex: n_sn }}, { mobile: { $regex: n_sn }}, { firstName: { $regex: n_sn }}, { surname: { $regex: n_sn }}, { middleName: { $regex: n_sn }}, { regCode: { $regex: n_sn }} ] },
        req.query
    ]).exec(function(err, registrations) {
        if (err) return handleError(res, err);

        return res.json(registrations);
    });
};

// Get a single registration
exports.show = function(req, res) {
  Registration.findById(req.params.id, function (err, registration) {
    if(err) { return handleError(res, err); }
    if(!registration) { return res.send(404); }
    return res.json(registration);
  });
};

// Creates a new registration in the DB.
exports.create = function(req, res) {

    if (req.body.isDirect || (req.body.sponsor && req.body.sponsor.length)) {
        req.body.regCode = Registration.pRef(5);
    }

  Registration.create(req.body, function(err, registration) {

    if(err) { return handleError(res, err); }

      if (registration.conferenceFee<=Number(registration.bankDeposit)) {

          if (req.body.sponsor != undefined) {
              //Add registration to sponsors
              Sponsor.findById(registration.sponsor, function(err, sponsor){
                  sponsor._delegates.push(registration);
                  sponsor.save(function(){
                      // Create Account
                      // Create User Account Using First Name and Last Name as Username
                      var username = (registration.firstName + registration.surname).split(' ').join('').toLowerCase();

                      // Find Existing User
                      User.find({email: username}, function (err, existingUsers) {

                          if (existingUsers.length) {
                              username += '_'+existingUsers.length;
                          }

                          var newPass = '123456';

                          var user = new User();
                          user.email = username;
                          user.password = user.generateHash(newPass);

                          user.save(function() {

                              registration.user = user;
                              registration.accountCreated = true;

                              registration.save(function ( err ) {

                                  if (err) { return handleError(res, err); }

                                  // Send Email to the User Here
                                  mailer.sendWelcomeMailWithUsername(registration, newPass, username, function (err){
                                      if (err !== null) { return handleError(res, err); }

                                      // Send the text message
                                      mailer.sendRegistrationTextWithUsername(registration, newPass, username, function (err){

                                          if (err!==null) { return handleError(res, err); }

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
                  if (err) { return handleError(res, err); }

                  return res.status(201).json(registration);
              });
          }
      }  else {
          return res.status(201).json(registration);
      }
  });
};

// Updates an existing registration in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Registration.findById(req.params.id, function (err, registration) {
    if (err) { return handleError(res, err); }
    if(!registration) { return res.send(404); }
    var updated = _.merge(registration, req.body);
      if (updated.conferenceFee<=Number(updated.bankDeposit)) {
          updated.responseGotten = true;
          updated.paymentSuccessful = true;
          updated.statusConfirmed = true;
      } else {
          updated.responseGotten = true;
          updated.paymentSuccessful = false;
          updated.statusConfirmed = false;
      }

    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, registration);
    });
  });
};

// Deletes a registration from the DB.
exports.destroy = function(req, res) {
  Registration.findById(req.params.id, function (err, registration) {
    if(err) { return handleError(res, err); }
    if(!registration) { return res.send(404); }
    registration.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
    console.log(err);
  return res.send(500, err);
}