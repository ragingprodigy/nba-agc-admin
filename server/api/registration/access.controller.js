'use strict';
var Access = require('./access.model');

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


function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
