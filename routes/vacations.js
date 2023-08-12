var express = require('express');
var router = express.Router();
var vacationCtrl = require('../controllers/vacations')

router.get('/', vacationCtrl.index);

router.get('/new', vacationCtrl.new)

router.post('/', vacationCtrl.vacationCreate)

//router.get('/:id', vacationCtrl.show)

module.exports = router;
