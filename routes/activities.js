const express = require('express');
const router = express.Router();

const activityCtrl = require('../controllers/activities')

router.post('/vacations/:id/activities', activityCtrl.create)

module.exports = router;