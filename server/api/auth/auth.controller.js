'use strict';

var _ = require('lodash'),
    jwt = require('jwt-simple'),
    moment = require('moment');

var User = require('./auth.model');

function createJWT(user) {

    var payload = {
        sub: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        iat: moment().unix(),
        exp: moment().add(14, 'days').unix()
    };
    return jwt.encode(payload, process.env.SESSION_SECRET);
}

// Get list of users
exports.index = function(req, res) {
    User.find(req.query, function (err, users) {
        if(err) { return handleError(res, err); }
        return res.json(200, users);
    });
};

// Get a single registration
exports.show = function(req, res) {
    User.findById(req.params.id, function (err, user) {
        if(err) { return handleError(res, err); }
        if(!user) { return res.send(404); }
        return res.json(user);
    });
};

// Creates a new registration in the DB.
exports.create = function(req, res) {
    User.create(req.body, function(err, user) {
        if(err) { return handleError(res, err); }
        return res.json(201, user);
    });
};

// Updates an existing registration in the DB.
exports.update = function(req, res) {
    console.log(req.body);
    if(req.body._id) { delete req.body._id; }
    User.findById(req.params.id, function (err, user) {
        if (err) { return handleError(res, err); }
        if(!user) { return res.send(404); }
        var updated = _.merge(user, req.body);

        updated.password = user.generateHash(updated.password);

        updated.save(function (err) {
            if (err) { return handleError(res, err); }
            return res.json(200, user);
        });
    });
};

// Deletes a registration from the DB.
exports.destroy = function(req, res) {
    User.findById(req.params.id, function (err, user) {
        if(err) { return handleError(res, err); }
        if(!user) { return res.send(404); }
        user.remove(function(err) {
            if(err) { return handleError(res, err); }
            return res.send(204);
        });
    });
};

exports.confirmReset = function(req, res){

    if (req.body.user === undefined || req.body.token === undefined) { return res.status(401).json({message: 'Invalid password reset request. Please go through the password recovery process again.' }); }

    User.findOne({ _id: req.body.member, resetToken: req.body.token }, function(err, theUser) {
        if (err) { handleError(res, err); }

        if (theUser) {

            if (moment().isBefore(theUser.tokenExpires)) {

                return res.status(200).json(theUser);

            } else {

                return res.status(401).json({message: 'Your password reset request has expired. Please make the request again.!'});
            }

        } else {
            return res.status(404).send({ message: 'Invalid request!' });
        }
    });
};

exports.changePassword = function (req, res) {

    if (req.body.password === undefined || req.body.user === undefined) { return res.status(400).json({message: 'Invalid password reset request. Please go through the password recovery process again.' }); }

    User.findById( req.body.user._id, '+password', function(err, theUser) {
        if (err) { handleError(res, err); }

        if (theUser) {

            theUser.password = theUser.generateHash(req.body.password);
            theUser.tokenExpires = moment().subtract(1, 'days').format();
            theUser.resetToken = "";

            theUser.save(function(err){

                if (err!==null) { return handleError(res, err); }

                delete theUser.password;

                return res.status(200).json(theUser);
            });

        } else {
            return res.status(404).send({ message: 'User not found!' });
        }
    });
};


exports.signUp = function(req, res) {

    User.findOne({ email: req.body.email }, function(err, existingUser) {
        if (existingUser) {
            return res.status(409).send({ message: 'An account with this email address already exists. It belongs to '+ existingUser.name });
        } else {

            var user = new User();

            user.email = req.body.email;
            user.name = req.body.name;
            user.role = req.body.role;
            user.password = user.generateHash(req.body.password);

            user.save(function() {
                delete user.password;

                res.send({token:createJWT(user)});

            });
        }
    });
};

exports.signIn = function(req, res) {
    User.findOne({ email: req.body.email }, '+password', function(err, user) {
        if (!user) {
            console.log(user);
            return res.status(401).send({ message: 'Wrong email and/or password' });
        }

        user.validPassword(req.body.password, function(err, isMatch) {
            if (!isMatch) {
                return res.status(401).send({ message: 'Wrong email and/or password. User found password error!' });
            }
            res.send({ token: createJWT(user) });
        });
    });
};

function handleError(res, err) {
    console.log('Auth Endpoint Error: ',err);
    return res.send(500, err);
}