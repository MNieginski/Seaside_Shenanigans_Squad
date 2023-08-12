const mongoose = require('mongoose')
const Schema = mongoose.Schema


const vacationSchema = new Schema ({
   location: {type:String},
   dates: {arrival: Date, departure: Date},
   activities: [Schema.Types.ObjectId],
   companions: [Schema.Types.ObjectId]
})

module.exports = mongoose.model('Vacation', vacationSchema)