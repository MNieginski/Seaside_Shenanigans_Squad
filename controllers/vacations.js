const Vacation = require("../models/vacation")
const User = require('../models/user')
const months= ["January","February","March","April","May","June","July",
            "August","September","October","November","December"];

function newVacation(req, res){
    res.render("vacations/new", {title: "Add Vacation", errorMsg: "", user: req.user})
}

async function showVacations(req, res) {
    let companionNames = []
    const vacation = await Vacation.findById(req.params.id)
    for(i=0; i<vacation.companions.length; i++){
newComp = await User.findById(vacation.companions[i])
companionNames.push(newComp.name)
    }
    res.render("vacations/show", { title: "Vacation Details", vacation, companionNames, months})
}

async function vacationCreate(req, res){
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
    const userinfo = req.user
    try {
        if (userinfo.username !== '') {const results = await Vacation.find({userId: req.user._id})
        //SORT HERE
        results.sort(compareDates)
        res.render('vacations/index', {title: "All Vacations", vacations: results, months})
    } else {res.render('vacations/username', {message: ''})}
    } catch (err){
        console.log(err.message)
        res.redirect('/')
    }
}

async function newUsername(req,res) {
    const username = req.body
    console.log('username', username)
    const findUser = await User.find(username)
    console.log('findUser', findUser[0])
    if (findUser[0]?.username === req.body.username) {res.render('vacations/username', {message: 'This username has been taken!'})
        } else { await User.findOneAndUpdate({_id: req.user._id}, username);
    res.redirect('/vacations')
}}

async function deleteVacation(req, res) {
    await Vacation.deleteOne({_id: req.params.id})
    res.redirect('/vacations')
}

async function edit(req, res) {
    let companionNames = ''
    const vacation = await Vacation.findById(req.params.id)
    const d=[vacation.departure.getFullYear(),vacation.departure.getUTCMonth()+1, vacation.departure.getUTCDate()]
    if(`${d[1]}`.length<2){d[1]=`0${d[1]}`}
    if(`${d[2]}`.length<2){d[2]=`0${d[2]}`}
    const a=[vacation.arrival.getFullYear(),vacation.arrival.getUTCMonth()+1, vacation.arrival.getUTCDate()]
    if(`${a[1]}`.length<2){a[1]=`0${a[1]}`}
    if(`${a[2]}`.length<2){a[2]=`0${a[2]}`}
    for(i=0; i<vacation.companions.length; i++){
        newComp = await User.findById(vacation.companions[i])
        companionNames+=`, ${newComp.name}`
            }
            console.log(companionNames)
    res.render('vacations/edit', {title: "Edit Vacation", vacation, d, a, companionNames})
}

async function update(req, res) {
    const updateData = {...req.body}
    console.log(updateData)
    for (let key in updateData) {
        if (updateData[key] === "") delete updateData[key]; 
      }
    const saveData = await Vacation.findOneAndUpdate({_id: req.params.id}, updateData)
    await saveData.save()
    res.redirect('/vacations/'+req.params.id)

}

function compareDates(a, b){
    return a.departure - b.departure
}




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
update,
newUsername,
}
