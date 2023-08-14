var express = require('express');
var router = express.Router();
var vacationCtrl = require('../controllers/vacations')
const ensureLoggedIn = require('../config/ensureLoggedIn')

router.get('/', ensureLoggedIn, vacationCtrl.index);

router.put('/', ensureLoggedIn, vacationCtrl.newUsername)

router.get('/new', ensureLoggedIn, vacationCtrl.new)

router.post('/', ensureLoggedIn, vacationCtrl.vacationCreate)

router.get('/:id', ensureLoggedIn, vacationCtrl.show)

router.delete('/:id', vacationCtrl.delete)

router.get('/:id/edit', ensureLoggedIn, vacationCtrl.edit)

router.put('/:id', ensureLoggedIn, vacationCtrl.update)

module.exports = router;
