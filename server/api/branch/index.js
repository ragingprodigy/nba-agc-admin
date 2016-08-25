'use strict';

var express = require('express');
var controller = require('./branch.controller');

var router = express.Router();

router.get('/', controller.index);

router.get('/uniqueList', controller.uniqueList);
router.get('/printData', controller.printData);

router.get('/onSiteUniqueList', controller.onSiteUniqueList);
router.get('/printOnsiteData', controller.printOnsiteData);

router.get('/printVip', controller.vipPrint);

router.get('/:id', controller.show);
router.post('/merge', controller.doMerge);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
