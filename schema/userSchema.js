const mongoose = require('mongoose')
const {Schema} = mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)

const userSchema = new Schema({
  user_id: { type: Number},
  username: { type: String},
  password: { type: String},
  approved: { type: Number}
})

userSchema.plugin(AutoIncrement, { inc_field: 'user_id' });

module.exports =  mongoose.model('user', userSchema);;