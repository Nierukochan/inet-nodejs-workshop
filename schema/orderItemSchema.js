var mongoose = require('mongoose')
var { Schema } = mongoose

const orderItemSchema = new Schema({
  product_id: {type: String, require: true},
  qty: {type: Number, require: true},
  total: {type: Number},
  status: {type: String,
    enum: ['in_cart','delete','done'],
    default: 'in_cart'
  }
})

module.exports = mongoose.model('orderItems', orderItemSchema)

