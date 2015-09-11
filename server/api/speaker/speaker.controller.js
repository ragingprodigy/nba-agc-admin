'use strict';

var _ = require('lodash');
var Speaker = require('./speaker.model');

// Get list of speakers
exports.index = function(req, res) {
  Speaker.find({}, '-photo_base64', function (err, speakers) {
    if(err) { return handleError(res, err); }
    return res.json(200, speakers);
  });
};

// Get a single speaker
exports.show = function(req, res) {
  Speaker.findById(req.params.id, function (err, speaker) {
    if(err) { return handleError(res, err); }
    if(!speaker) { return res.send(404); }
    return res.json(speaker);
  });
};

function encodeImage(url, callback) {
    var URL = require('url'),
        sURL = url || 'https://s3-eu-west-1.amazonaws.com/nba-agc/user.png',
        oURL = URL.parse(sURL),
        http = require('http'),
        request = http.request({method:'GET', path:oURL.pathname, host: oURL.hostname, port:80});

    request.end();
    request.on('response', function (response) {
        var type = response.headers["content-type"],
            prefix = "data:" + type + ";base64,",
            body = "";

        response.setEncoding('binary');
        response.on('end', function () {
            var base64 = new Buffer(body, 'binary').toString('base64'),
                data = prefix + base64;
            return callback(data);
        });

        response.on('data', function (chunk) {
            if (response.statusCode == 200) body += chunk;
        });
    });
}

// Creates a new speaker in the DB.
exports.create = function(req, res) {
    var toCreate = req.body;
    encodeImage(toCreate.photo, function(base64){
        toCreate.photo_base64 = base64;
        Speaker.create(toCreate, function(err, speaker) {
            if(err) { return handleError(res, err); }
            return res.json(201, speaker);
        });
    });
};

// Updates an existing speaker in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Speaker.findById(req.params.id, function (err, speaker) {
    if (err) { return handleError(res, err); }
    if(!speaker) { return res.send(404); }
    var updated = _.merge(speaker, req.body);
      encodeImage(req.body.photo, function(data){
          updated.photo_base64 = data;
          updated.save(function (err) {
              if (err) { return handleError(res, err); }
              return res.json(200, speaker);
          });
      });

  });
};

// Deletes a speaker from the DB.
exports.destroy = function(req, res) {
  Speaker.findById(req.params.id, function (err, speaker) {
    if(err) { return handleError(res, err); }
    if(!speaker) { return res.send(404); }
    speaker.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}