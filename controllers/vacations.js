const Vacation = require("../models/vacation")

function newVacation(req, res){
    res.render("vacations/new", {title: "Add Vacation", errorMsg: ""})
}

async function vacationCreate(req, res){
    const vacationData = {...req.body}
    console.log(req.body)
    try{
        console.log(vacationData)
        //const createdVacation = 
        await Vacation.create(vacationData)
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
index
}