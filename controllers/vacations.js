const Vacation = require("../models/vacation")
const User = require('../models/user');
const vacation = require("../models/vacation");
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
    vacationData.companions = vacationData.companions.split(/\s*,\s*/)
    vacationData.companions = await getFriends(vacationData.companions)
    for (let key in vacationData) {
        if (vacationData[key] === "") delete vacationData[key]; // if any fields store an empty string, remove the correspoding key so the default data is sent instead.
    }
    try{
        const createVacation = await Vacation.create(vacationData);
        let user = await (User.findById(req.user._id))
        await user.vacations.push(createVacation._id)
        user.save()
        await addVacationToCompanions(vacationData.companions, createVacation._id)
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

// async function index(req, res){
//     const userinfo = req.user
//     try {
//         if (userinfo.username !== '') {const results = await Vacation.find({userId: req.user._id})
//         results.sort(compareDates)
//         res.render('vacations/index', {title: "All Vacations", vacations: results, months})
//     } else {res.render('vacations/username', {message: '', avatar: userinfo.avatar})}
//     } catch (err){
//         console.log(err.message)
//         res.redirect('/')
//     }
// }
async function index(req, res){
    const userinfo = req.user
    try {
        if (userinfo.username !== '') {const user = await User.findById(req.user._id)
            const results = await findUserVacations(user.vacations)
        results.sort(compareDates)
        res.render('vacations/index', {title: "All Vacations", vacations: results, months})
    } else {res.render('vacations/username', {message: '', avatar: userinfo.avatar})}
    } catch (err){
        console.log(err.message)
        res.redirect('/')
    }
}

async function newUsername(req,res) {
    const username = req.body
    const findUser = await User.find(username)
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
        companionNames+=`, ${newComp.username}`
            }
    res.render('vacations/edit', {title: "Edit Vacation", vacation, d, a, companionNames})
}

async function update(req, res) {
    const updateData = {...req.body}
    updateData.companions = updateData.companions.split(/\s*,\s*/)
    updateData.companions = await getFriends(updateData.companions)
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



async function getFriends(companions){
    let friends = []
        for(i=0; i<companions.length; i++){
        newguy = await User.findOne({username: companions[i]})
        friends.push(newguy)
        }
        return friends
}


async function addVacationToCompanions(companions, vacationId){
for(i=0; i<companions.length; i++){
let companion = await User.findById(companions[i])
companion.vacations.push(vacationId)
await companion.save()
}
}

async function findUserVacations(vacations){
    let vacationsFind = []
for(i=0; i<vacations.length; i++){
    let vacation = await Vacation.findById(vacations[i])
    vacationsFind.push(vacation)
}
console.log(vacationsFind)
return vacationsFind
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


//64daa073f063bdaee917931c