'use strict';

var express = require('express');
var controller = require('./user.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', sessionSec, controller.index);
router.get('/getTags', sessionSec, controller.getTags);
router.get('/:id', sessionSec, controller.show);
router.post('/:id/reset', sessionSec, controller.reset);

module.exports = router;