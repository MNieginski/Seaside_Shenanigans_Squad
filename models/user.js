const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  vacations:[{
    type: Schema.Types.ObjectId,
    ref: 'Vacation'
  }],
  //over21: Boolean,
  //location:
  googleId: {
    type: String,
    required: true
  },
  email: String,
  avatar: String,
  username: {type: String, default:''}
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
