var express = require('express');
var router = express.Router();
var vacationCtrl = require('../controllers/vacations')
const ensureLoggedIn = require('../config/ensureLoggedIn')
const multer = require("multer");

const upload = multer();

router.get('/', vacationCtrl.index);

router.put('/', ensureLoggedIn, vacationCtrl.newUsername)

router.get('/new', ensureLoggedIn, vacationCtrl.new)

router.post('/', ensureLoggedIn, vacationCtrl.vacationCreate)

router.get('/:id', ensureLoggedIn, vacationCtrl.show)

router.delete('/:id', vacationCtrl.delete)

router.get('/:id/edit', ensureLoggedIn, vacationCtrl.edit)

router.put('/:id', ensureLoggedIn, vacationCtrl.update)

router.post(
    "/:id/photos/single",
    upload.single("imageUpload"),
    vacationCtrl.uploadPhoto
  );

 router.delete('/:vid/:pid', ensureLoggedIn, vacationCtrl.deletePhoto) 

module.exports = router;
