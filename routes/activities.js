const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit')
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


const limiter = rateLimit({
  windowMs: 1000*60,
  max: 3,
  message:"Robo travel agents can only work so fast! Three requests per minute."
})

const activityCtrl = require('../controllers/activities')

router.post('/vacations/:id/activities', activityCtrl.create)

router.delete('/vacations/:vid/:aid', activityCtrl.delete)

router.get('/vacations/:id/activities/new', limiter, activityCtrl.getResponse)

router.post('/vacations/:id', activityCtrl.showActivity)

module.exports = router;