const Vacation = require("../models/vacation")

async function vacationCreate(req, res){
    Vacation.deleteMany({},)
}

async function vacationDeleteAll(req, res){
    await Vacation.deleteMany({location: 'france'})
}
    
async function getVacations(req, res){
    console.log(await Vacation.find({}))
}

function index(req, res){
res.send('hit index')
}

module.exports = {
vacationCreate,
getVacations,
vacationDeleteAll,
index
}
