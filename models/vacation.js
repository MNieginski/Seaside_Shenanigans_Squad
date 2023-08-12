const mongoose = require('mongoose')
const Schema = mongoose.Schema


const vacationSchema = new Schema ({
   location: {type:String},
   arrival: {type:Date},
   departure: {type:Date},
   activities: [Schema.Types.ObjectId],
   companions: [Schema.Types.ObjectId]
})

module.exports = mongoose.model('Vacation', vacationSchema)