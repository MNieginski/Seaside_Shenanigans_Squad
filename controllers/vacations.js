const Vacation = require("../models/vacation");
const User = require("../models/user");
const vacation = require("../models/vacation");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
const { clConfig } = require("../config/cloudinary.js");

cloudinary.config(clConfig);


async function newVacation(req, res) {
  const users = await User.find();
  let userArray = [];
  users.forEach((user) => {
    userArray.push(user.username);
  });

  res.render("vacations/new", {
    title: "Add Vacation",
    errorMsg: "",
    user: req.user,
    userArray,
  });
}

async function showVacations(req, res) {
const vacation = await Vacation.findById(req.params.id);
let creatorUser = await User.findById(vacation.userId);
let creatorName = creatorUser.name;
let companionNames = await getFriendsNames(vacation.companions)
let nameIdx = companionNames.findIndex((name)=>name===req.user.name)
if (nameIdx !== -1) {
companionNames.splice(nameIdx, 1, creatorName)
}
  res.render("vacations/show", {
    title: "Vacation Details",
    vacation,
    companionNames,
    months,
  });
}

async function vacationCreate(req, res) {
  const vacationData = { ...req.body };
  for (let key in vacationData) {
    if (vacationData[key] === "") delete vacationData[key]; // if any fields store an empty string, remove the correspoding key so the default data is sent instead.
  }
  if (vacationData.companions) {
    vacationData.companions = vacationData.companions.split(/\s*,\s*/);
    vacationData.companions = await getFriends(vacationData.companions);
  } else {
    vacationData.companions = [];
  }
  try {
    const createVacation = await Vacation.create(vacationData);
    let user = await User.findById(req.user._id);
    await user.vacations.push(createVacation._id);
    user.save();
    await addVacationToCompanions(vacationData.companions, createVacation._id);
    res.redirect("/vacations");
  } catch (err) {
    res.render("vacations/new", { errorMsg: err.message });
  }
}

async function vacationDeleteAll(req, res) {
  await Vacation.deleteMany({});
}

async function getVacations(req, res) {
  console.log(await Vacation.find({}));
}

//This function finds all trips you've created
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

async function index(req, res) {
  const userinfo = req.user;
  try {
    if (userinfo.username !== "") {
      const user = await User.findById(req.user._id);
      const results = await findUserVacations(user.vacations);
      results.sort(compareDates);
      res.render("vacations/index", {
        title: "All Vacations",
        vacations: results,
        months,
      });
    } else {
      res.render("vacations/username", {
        message: "",
        avatar: userinfo.avatar,
      });
    }
  } catch (err) {
    console.log(err.message);
    res.redirect("/");
  }
}

async function newUsername(req, res) {
  const username = req.body;
  const findUser = await User.find(username);
  if (findUser[0]?.username === req.body.username) {
    res.render("vacations/username", {
      message: "This username is already taken!",
    });
  } else {
    await User.findOneAndUpdate({ _id: req.user._id }, username);
    res.redirect("/vacations");
  }
}

async function deleteVacation(req, res) {
  let vacation = await Vacation.findById(req.params.id);
  let creator = await User.findById(vacation.userId);
  creator.vacations.splice(
    creator.vacations.findIndex((v) => {
      return v._id.toString(0) === req.params.id;
    }),
    1
  );
  await creator.save();
  await removeVacationFromCompanions(vacation);
  await Vacation.deleteOne({ _id: req.params.id });
  res.redirect("/vacations");
}

async function edit(req, res) {
  let companionNames = "";
  const users = await User.find();
  const vacation = await Vacation.findById(req.params.id);
  const d = [
    vacation.departure.getFullYear(),
    vacation.departure.getUTCMonth() + 1,
    vacation.departure.getUTCDate(),
  ];
  if (`${d[1]}`.length < 2) {
    d[1] = `0${d[1]}`;
  }
  if (`${d[2]}`.length < 2) {
    d[2] = `0${d[2]}`;
  }
  const a = [
    vacation.arrival.getFullYear(),
    vacation.arrival.getUTCMonth() + 1,
    vacation.arrival.getUTCDate(),
  ];
  if (`${a[1]}`.length < 2) {
    a[1] = `0${a[1]}`;
  }
  if (`${a[2]}`.length < 2) {
    a[2] = `0${a[2]}`;
  }
  for (i = 0; i < vacation.companions.length; i++) {
    newComp = await User.findById(vacation.companions[i]);
    companionNames += `, ${newComp.username}`;
    
  }
  let userArray = [];
  users.forEach((user) => {
    userArray.push(user.username);
  });
  res.render("vacations/edit", {
    title: "Edit Vacation",
    vacation,
    d,
    a,
    companionNames,
    userArray,
    user: req.user
  });
}

async function update(req, res) {
  const updateData = { ...req.body };
  if (updateData.companions) {
    updateData.companions = updateData.companions.split(/\s*,\s*/);
    updateData.companions = await getFriends(updateData.companions);
  } else {
    updateData.companions = [];
  }
  for (let key in updateData) {
    if (updateData[key] === "") delete updateData[key];
  }
  const saveData = await Vacation.findOneAndUpdate(
    { _id: req.params.id },
    updateData
  );
  await saveData.save();
  res.redirect("/vacations/" + req.params.id);
}

function compareDates(a, b) {
  return a.departure - b.departure;
}

//gets ID based on usernames typed in companions field
async function getFriends(companions) {
  let friends = [];
  for (i = 0; i < companions.length; i++) {
    newguy = await User.findOne({ username: companions[i] });
    friends.push(newguy);
  }
  return friends;
}

//gets usernames based on companion IDs in array
async function getFriendsNames(companions) {
  let friends = [];
  for (i = 0; i < companions.length; i++) {
    newguy = await User.findById(companions[i]);
    friends.push(newguy.name);
  }
  return friends;
}

async function addVacationToCompanions(companions, vacationId) {
  for (i = 0; i < companions.length; i++) {
    let companion = await User.findById(companions[i]);
    companion.vacations.push(vacationId);
    await companion.save();
  }
}

async function findUserVacations(vacations) {
  let vacationsFind = [];
  for (i = 0; i < vacations.length; i++) {
    let vacation = await Vacation.findById(vacations[i]);
    vacationsFind.push(vacation);
  }
  return vacationsFind;
}

async function removeVacationFromCompanions(vacation) {
  for (i = 0; i < vacation.companions.length; i++) {
    let companion = await User.findById(vacation.companions[i]);
    companion.vacations.splice(
      companion.vacations.findIndex((v) => {
        return v._id.toString(0) === vacation._id;
      }),
      1
    );
    await companion.save();
  }
}


async function uploadPhoto(req, res, next) {
  try {
    let response = await streamUpload(req);
    const foundVacation = await Vacation.findById(req.params.id)
    const photoData = {...req.body, url: response.url}
    foundVacation.images.push(photoData)
    await foundVacation.save()
    res.redirect(`/vacations/${req.params.id}`);
  } catch (err) {
    console.log(err);
    next(Error(err));
  }
}

function streamUpload(req) {
  return new Promise(function (resolve, reject) {
    let stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });

    streamifier.createReadStream(req.file.buffer).pipe(stream);
  });
}

async function deletePhoto(req, res) {
    const vacation = await Vacation.findById(req.params.vid)
    console.log(vacation)
    let idx = vacation.images.findIndex(photo=>{
        return photo._id.toString()===req.params.pid
})
    vacation.images.splice(idx, 1)
    await vacation.save()
    res.redirect(`/vacations/${vacation._id}`)
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
  uploadPhoto,
  deletePhoto
};


