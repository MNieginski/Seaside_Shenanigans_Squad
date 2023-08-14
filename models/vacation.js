const mongoose = require('mongoose')
const Schema = mongoose.Schema


const activitiesSchema = new Schema ({
   name: {type: String}, 
   description: {type: String},
   dateTime: {type: Date},
})

const vacationSchema = new Schema ({
   location: {type:String},
   arrival: {type:Date, required: true},
   departure: {type:Date, required: true},
   companions:{
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true
    },
    userId: String,
    activities: [activitiesSchema]
})

module.exports = mongoose.model('Vacation', vacationSchema)