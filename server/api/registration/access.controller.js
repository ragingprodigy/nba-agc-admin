'use strict';
var Access = require('./access.model');
var _ = require('lodash');

exports.index = function (req,res) {
  var condition = {
    resolved:false,
    deleted:{$exists:false}
  };
  if(req.query.dataType == 'offline'){
    condition.dataType = 'offline';
  }
  else if (req.query.dataType == 'online')
  {
    condition.dataType = 'online';
  }

  Access.find(condition, function (err, data) {
    if(err){ return handleError(res, err)}
    var len = 0;
    for (len;len<data.length;len++){
      var branch = data[len].Branch.split(' ').trim();
      if (branch[0] == 'ABUJA')
      {
        data[len].Branch = 'ABUJA (UNITY BAR)';
      }
      else if(branch[0] == 'IKOTEKPENE')
      {
        data[len].Branch = 'IKOT EKPENE';
      }
      else if(branch[0] == 'MAKUDI')
      {
        data[len].Branch = 'MAKURDI';
      }
      else {
        data[len].Branch = branch[0];
      }

      if(data[len].Prefix=='NIL' || data[len].Prefix=='NA' || data[len].Prefix=='N/A')
      {
        data[len].Prefix = '';
      }
      if(data[len].Suffix=='NIL' || data[len].Suffix=='NA' || data[len].Suffix=='N/A')
      {
        data[len].Suffix = '';
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
