const Vacation = require("../models/vacation")
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
    create,
    delete: deleteActivity,
    getResponse,
    showActivity
}

async function create(req, res) {
    const vacation = await Vacation.findById(req.params.id)
    vacation.activities.push(req.body)
    try {
        await vacation.save()
    } catch (err) {
        console.log(err)
    }
    res.redirect(`/vacations/${vacation._id}`)
}

async function deleteActivity(req, res) {
    console.log('hit')
    const vacation = await Vacation.findById(req.params.vid)
    let idx = vacation.activities.findIndex(activity=>{
        return activity._id.toString()===req.params.aid
    })
    vacation.activities.splice(idx, 1)
    await vacation.save()
   res.redirect(`/vacations/${vacation._id}`)
}


async function getResponse(req,res, next) {

    const thisVacation = await Vacation.findById(req.params.id)

    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
            {
                role: 'system',
                content: `I will be in ${thisVacation.location} between ${thisVacation.departure} and ${thisVacation.arrival}, suggest one activity for me to do. Create an Activity Title (3 words or less) and a Description (2-3 sentences), but do not include the words "Activity Title" or "Description" at all. Look at the existing activities in ${thisVacation} ( ${thisVacation.activities.name} and ${thisVacation.activities.description}) and do not repeat any of that content. Suggest activities relevant to the time of year between ${thisVacation.departure} and ${thisVacation.arrival}.
                The activity should be formatted like this:
                (Activity Title): (Activity Description)`
            },
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
    });
    const message = response.data.choices[0].message
    const activityContent = message.content
    const splitEm = activityContent.split(': ')
    const newTitle = splitEm[0]
    const newActivity = splitEm[1]
    const activityObj = {name: newTitle, description: newActivity}
    showActivity(req, res, next, activityObj);
}

async function showActivity(req, res, next, activityObj) {
    const vacation = await Vacation.findById(req.params.id)

    vacation.activities.push(activityObj)

    try {
        await vacation.save()
    } catch (err) {
        console.log(err)
    }

    res.redirect(`/vacations/${vacation._id}`)
}