'use strict';

var express = require('express'),
    controller = require('./sponsor.controller'),
    sessionSec = require('../../components/tools/sessionSec'),
    router = express.Router();

router.get('/', sessionSec, controller.index);
router.get('/:id', sessionSec, controller.show);
router.get('/:id/delegates', sessionSec, controller.show);

router.post('/', sessionSec, controller.create);
router.put('/:id', sessionSec, controller.update);
router.patch('/:id', sessionSec, controller.update);

module.exports = router;