'use strict';

var Bag = require('./bag.model');

// Get list of bags
exports.index = function(req, res) {
    Bag.find({ quantity: { "$gt": 0 }}).sort('_id').exec(function(err, bags){
        if (err) { return handleError(res, err); }
        return res.json(bags);
    });
};

function handleError(res, err) {
  return res.send(500, err);
}