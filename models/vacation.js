const mongoose = require('mongoose')
const Schema = mongoose.Schema


const vacationSchema = new Schema ({
   location: {type:String},
   arrival: {type:Date, required: true},
   departure: {type:Date, required: true},
   activities: [Schema.Types.ObjectId],
   companions:{
      type: [Schema.Types.ObjectId],
      ref: 'User',
      required: true
    },
    userId: String
})

module.exports = mongoose.model('Vacation', vacationSchema)