const express = require('express');
const router = express.Router();

const activityCtrl = require('../controllers/activities')

router.post('/vacations/:id/activities', activityCtrl.create)

router.delete('/vacations/:vid/:aid', activityCtrl.delete)

module.exports = router;