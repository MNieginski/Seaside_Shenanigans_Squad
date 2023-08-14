const Vacation = require("../models/vacation")

module.exports = {
    create
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
