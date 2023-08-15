const Vacation = require("../models/vacation")





module.exports = {
    create,
    delete: deleteActivity
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
    const vacation = await Vacation.findById(req.params.vid)
    //const activityString = activity._id.toString()
    let idx = vacation.activities.findIndex(activity=>{
        return activity._id.toString()===req.params.aid
})
    vacation.activities.splice(idx, 1)
    await vacation.save()
    // await Activity.deleteOne({_id: req.params.aid})
    res.redirect(`/vacations/${vacation._id}`)
}
