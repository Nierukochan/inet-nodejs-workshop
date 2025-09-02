var mongoose = require('mongoose')
var orderSchema = require('./orderSchema')
var { Schema } = mongoose

const orderItemSchema = new Schema({
  user_id: {type: String, require: true},
  items: [
    {
      order_id: { type: String, required: true }
    }
  ],
  status: {
    type: String,
    enum: ['active', 'checked_out', 'finish', 'abandoned'],
    default: 'active'
  },
  total: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('orderItems', orderItemSchema)

