'use strict';
var Access = require('./access.model');
var _ = require('lodash');

exports.index = function (req,res) {
  Access.find({resolved:false,dataType:'offline'}, function (err, data) {
    if(err){ return handleError(res, err)}
    var len = 0;
    for (len;len<data.length;len++){
      var branch = data[len].Branch.split(' ');
      data[len].Branch = branch[0];
      if(data[len].Prefix=='NIL')
      {
        data[len].Prefix = '';
      }
    }
    return res.json(data);
  })
};

exports.resolve = function (req,res) {
  Access.findById(req.body._id, function (err, access) {
    if (err) { return handleError(res, err); }
    if(!access) { return res.send(404); }
    var updated = _.merge(access, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, {id:access._id});
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
