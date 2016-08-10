'use strict';

var express = require('express');
var controller = require('./user.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();
router.get('/', sessionSec, controller.index);
router.get('/getGroups', sessionSec, controller.getGroups);
router.get('/getTags', sessionSec, controller.getTags);
router.get('/getRegistrationTags', sessionSec, controller.getRegistrationTags);
router.post('/create',sessionSec, controller.create);
router.get('/allUsersForNameTags', sessionSec, controller.allUsersForNameTags);
router.get('/:id', sessionSec, controller.show);
router.post('/:id/reset', sessionSec, controller.reset);


module.exports = router;
