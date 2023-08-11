var express = require('express');
var router = express.Router();
var vacationCtrl = require('../controllers/vacations')


router.get('/', vacationCtrl.index);

module.exports = router;
