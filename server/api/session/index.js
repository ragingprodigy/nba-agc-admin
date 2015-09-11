'use strict';

var express = require('express');
var controller = require('./session.controller');
var sessionSec = require('../../components/tools/sessionSec');

var router = express.Router();

router.get('/', sessionSec, controller.index);
router.get('/:id', sessionSec, controller.show);

router.post('/', sessionSec, controller.create);
router.put('/:id', sessionSec, controller.update);
router.patch('/:id', sessionSec, controller.update);
router.delete('/:id', sessionSec, controller.destroy);

router.delete('/:id/papers/:paperId', sessionSec, controller.deletePaper);
router.post('/:id/papers', sessionSec, controller.addPaper);

router.delete('/:id/questions/:questionId', sessionSec, controller.deleteQuestion);

module.exports = router;