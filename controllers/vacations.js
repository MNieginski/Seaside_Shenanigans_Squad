const Vacation = require("../models/vacation")

async function vacationCreate(req, res){

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
vacationCreate,
getVacations,
vacationDeleteAll,
index
}