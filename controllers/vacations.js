const Vacation = require("../models/vacation")

function newVacation(req, res){
    res.render("vacations/new", {title: "Add Vacation", errorMsg: ""})
}

async function vacationCreate(req, res){
    const vactionData = {...req.body}
    try{
        const createdVacation = await Vacation.create(vacationData)
        res.redirect("/vacations")
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

function index(req, res){
res.render('vacations/index')
}

module.exports = {
new: newVacation,
vacationCreate,
getVacations,
vacationDeleteAll,
index
}