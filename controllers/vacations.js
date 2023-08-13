const Vacation = require("../models/vacation")
const User = require('../models/user')

function newVacation(req, res){
    res.render("vacations/new", {title: "Add Vacation", errorMsg: "", user: req.user})
}

async function showVacations(req, res) {
    const vacation = await Vacation.findById(req.params.id)
    res.render("vacations/show", { title: "Vacation Details", vacation})
}

async function vacationCreate(req, res){
    console.log(req.body)
    const vacationData = {...req.body}
    for (let key in vacationData) {
        if (vacationData[key] === "") delete vacationData[key]; // if any fields store an empty string, remove the correspoding key so the default data is sent instead.
      }
    try{
         const createVacation = await Vacation.create(vacationData);
         let user = await (User.findById(req.user._id))
        await user.vacations.push(createVacation._id)
        user.save()
        res.redirect("/vacations")
    } catch (err) {
        res.render("vacations/new", {errorMsg: err.message})
    }
}

async function vacationDeleteAll(req, res){
    await Vacation.deleteMany({})
}
    
async function getVacations(req, res){
    console.log(await Vacation.find({}))
}

async function index(req, res){

    try {
        const results = await Vacation.find({userId: req.user._id})
        //SORT HERE
        results.sort(compareDates)
        res.render('vacations/index', {title: "All Vacations", vacations: results, months})
    } catch (err){
        console.log(err.message)
        res.redirect('/')
    }
}

async function deleteVacation(req, res) {
    await Vacation.deleteOne({_id: req.params.id})
    res.redirect('/vacations')
}

function edit(req, res) {
    res.render('vacations/edit', {title: "Edit Vacation", vacation: req.params.id})
}

async function update(req, res) {
    const updateData = {...req.body}
    const saveData = await Vacation.findOneAndUpdate({_id: req.params.id}, {updateData})
    await saveData.save()
    res.redirect('/vacations/'+req.params.id)

}

function compareDates(a, b){
    return a.departure - b.departure
}


const months= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

module.exports = {
new: newVacation,
vacationCreate,
getVacations,
vacationDeleteAll,
show: showVacations,
index,
months,
delete: deleteVacation,
edit,
update
}
