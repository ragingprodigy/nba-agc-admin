/**
 * Created by oladapo on 8/12/15.
 */
'use strict';

var AWS = require('aws-sdk'),
    crypto = require('crypto'),
    createS3Policy,
    getExpiryTime;

getExpiryTime = function () {
    var _date = new Date();
    return '' + (_date.getFullYear()) + '-' + (_date.getMonth() + 1) + '-' +
        (_date.getDate() + 1) + 'T' + (_date.getHours() + 3) + ':' + '00:00.000Z';
};

createS3Policy = function(contentType, subFolder, callback) {
    var s3Policy = {
        'expiration': getExpiryTime(),
        'conditions': [
            ['starts-with', '$key', subFolder],
            {'bucket': 'nba-agc'},
            {'acl': 'public-read'},
            ['starts-with', '$Content-Type', contentType]
        ]
    };

    // stringify and encode the policy
    var stringPolicy = JSON.stringify(s3Policy);
    var base64Policy = new Buffer(stringPolicy, 'utf-8').toString('base64');

    // sign the base64 encoded policy
    var signature = crypto.createHmac('sha1', 'ZQRUw9sLGbfM6S7ai+pPhWVszgdLmPXp4Ptxs4gB')
        .update(new Buffer(base64Policy, 'utf-8')).digest('base64');

    // build the results object
    var s3Credentials = {
        s3Policy: base64Policy,
        s3Signature: signature,
        AWSAccessKeyId: 'AKIAIDA2QP3HZRPXR76Q'
    };

    // send it back
    callback(s3Credentials);
};

exports.getS3Policy = function(req, res) {
    createS3Policy(req.query.mimeType, req.query.type, function (creds, err) {
        if (!err) {
            return res.send(200, creds);
        } else {
            return res.send(500, err);
        }
    });
};