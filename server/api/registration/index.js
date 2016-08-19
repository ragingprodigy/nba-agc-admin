'use strict';

var express = require('express');
var controller = require('./registration.controller');
var controller2 = require('./access.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/access/index', sessionSec, controller2.index);
router.get('/check', sessionSec, controller.check);
router.get('/', sessionSec, controller.index);
router.get('/fast', sessionSec, controller.fast);
router.get('/stats', sessionSec, controller.stats);
router.get('/withTags', sessionSec, controller.withTags);
router.get('/fastTrack', sessionSec, controller.fastTrack);
router.post('/branchFastTracked', controller.branchFastTracked);
router.post('/individualFastTracked', controller.individualFastTracked);
router.post('/access/resolve', sessionSec, controller2.resolve);
router.get('/qrCode', controller.qrCode);
router.get('/qrCodeInstant', controller.qrCodeInstant);

router.get('/groupReport', controller.groupReport);
router.get('/branchReport', controller.namesByBranch);

router.post('/createOfflineReg', sessionSec, controller.createOfflineReg);
router.get('/:id', sessionSec, controller.show);
router.post('/', sessionSec, controller.create);
router.post('/:id', sessionSec, controller.finalizeDelegate);
router.put('/:id', sessionSec, controller.update);
router.patch('/:id', sessionSec, controller.update);

module.exports = router;
