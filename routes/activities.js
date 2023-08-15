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

const userInput = 'Success Tips';

const getResponse = async () => {
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `I will be in Spain between October 12, 2023 and October 25 2023, suggest one activity for me to do. Format should be: Activity Title (3 words or less, punny):, Description (3 sentences or less):.`,
            },
        ],
        temperature: 0,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
    });
    console.log(response.data.choices[0].message);
}

getResponse();

module.exports = router;