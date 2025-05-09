const mongoose = require('mongoose')
const {Schema} = mongoose

const productSchema = new Schema({
  // product_id: {type: Number},
  image: {type: String},
  name: {type: String},
  qty: {type: Number},
  type: {type: String},
  // description: {type: String},
  price: {type: Number}
})

module.exports = mongoose.model('product',productSchema)