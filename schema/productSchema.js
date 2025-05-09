const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({
  image: {type: String, require: true},
  name: {type: String, require: true},
  qty: {type: Number, require: true},
  type: {type: String, require: true},
  // description: {type: String},
  price: {type: Number, require: true}
})

module.exports = mongoose.model('product',productSchema)