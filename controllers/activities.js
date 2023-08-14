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
    let idx = vacation.activities.findIndex(activity=>{
        return activity._id.toString()===req.params.aid

})
    console.log(idx)

    res.redirect(`/vacations/${vacation._id}`)
}
