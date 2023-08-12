var express = require('express');
var router = express.Router();
var vacationCtrl = require('../controllers/vacations')

router.get('/', vacationCtrl.index);

router.get('/new', vacationCtrl.new)

//router.post('/', vactionCtrl.create)

//router.get('/:id', cactionCtrl.show)

module.exports = router;
