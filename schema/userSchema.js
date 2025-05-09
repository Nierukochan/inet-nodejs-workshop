const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
  // email: { type: String},
  username: { type: String ,require: true},
  password: { type: String ,require: true},
  approved: { type: Boolean, default: false},
  isAdmin: { type: Boolean, default: true},
})

module.exports =  mongoose.model('user', userSchema);;