const mongoose = require('mongoose')
const Schema = mongoose.Schema


const vacationSchema = new Schema ({
   location: {type:String},
   arrival: {type:Date,
      default: function() {
      new Date().toLocaleDateString('en-us', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
;
   }},
   departure: {type:Date},
   activities: [Schema.Types.ObjectId],
   companions: [Schema.Types.ObjectId]
})

module.exports = mongoose.model('Vacation', vacationSchema)