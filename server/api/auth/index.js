'use strict';

var express = require('express');
var controller = require('./auth.controller');
var sessionSec = require('../../components/tools/sessionSec');
var router = express.Router();

router.post('/login', controller.signIn);
router.post('/create', controller.signUp);
router.post('/confirmResetRequest', controller.confirmReset);
router.post('/changePassword', controller.changePassword);

router.get('/', sessionSec, controller.index);
router.get('/:id', sessionSec, controller.show);
router.put('/:id', sessionSec, controller.update);
router.patch('/:id', sessionSec, controller.update);
//router.delete('/:id', sessionSec, controller.destroy);

module.exports = router;