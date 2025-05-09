const mongoose = require('mongoose')
const {Schema} = mongoose

const userSchema = new Schema({
  // email: { type: String},
  username: { type: String},
  password: { type: String},
  approved: { type: Boolean, default: false},
  isAdmin: { type: Boolean, default: false},
})

module.exports =  mongoose.model('user', userSchema);;