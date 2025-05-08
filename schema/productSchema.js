const mongoose = require('mongoose')
const {Schema} = mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)

const productSchema = new Schema({
  product_id: {type: Number},
  name: {type: String},
  qty: {type: Number},
  type: {type: String},
  price: {type: Number}
})

productSchema.plugin(AutoIncrement, { inc_field: 'product_id' });

module.exports = mongoose.model('product',productSchema)