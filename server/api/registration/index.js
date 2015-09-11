'use strict';

var express = require('express');
var controller = require('./registration.controller');

var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', sessionSec, controller.index);
router.get('/stats', sessionSec, controller.stats);
router.get('/withTags', sessionSec, controller.withTags);
router.get('/fastTrack', sessionSec, controller.fastTrack);

router.get('/qrCode', controller.qrCode);
router.get('/qrCodeInstant', controller.qrCodeInstant);

router.get('/groupReport', controller.groupReport);
router.get('/branchReport', controller.namesByBranch);

router.get('/:id', sessionSec, controller.show);
router.post('/', sessionSec, controller.create);
router.post('/:id', sessionSec, controller.finalizeDelegate);
router.put('/:id', sessionSec, controller.update);
router.patch('/:id', sessionSec, controller.update);

module.exports = router;