const Vacation = require("../models/vacation")

function newVacation(req, res){
    res.render("vacations/new", {title: "Add Vacation", errorMsg: ""})
}

async function showVacations(req, res) {
    const vacation = await Vacation.findById(req.params.id)
    res.render("vacations/show", { title: "Vacation Details", vacation})
}

async function vacationCreate(req, res){
    const vacationData = {...req.body}
    for (let key in vacationData) {
        if (vacationData[key] === "") delete vacationData[key]; // if any fields store an empty string, remove the correspoding key so the default data is sent instead.
      }
    try{
        console.log(vacationData)
        const createVacation = await Vacation.create(vacationData);
        console.log(createVacation)
        res.redirect("/vacations/")
    } catch (err) {
        res.render("vacations/new", {errorMsg: err.message})
    }
}

async function vacationDeleteAll(req, res){
    await Vacation.deleteMany({location: 'france'})
}
    
async function getVacations(req, res){
    console.log(await Vacation.find({}))
}

async function index(req, res){
    try {
        const results = await Vacation.find({})
        res.render('vacations/index', {title: "All Vacations", vacations: results})
    } catch (err){
        console.log(err.message)
        res.redirect('/')
    }
}

module.exports = {
new: newVacation,
vacationCreate,
getVacations,
vacationDeleteAll,
show: showVacations,
index
}