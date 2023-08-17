const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);




const activityCtrl = require('../controllers/activities')

router.post('/vacations/:id/activities', activityCtrl.create)

router.delete('/vacations/:vid/:aid', activityCtrl.delete)

router.get('/vacations/:id/activities/new', activityCtrl.getResponse)

router.post('/vacations/:id', activityCtrl.showActivity)




module.exports = router;