const mongoose = require('mongoose')
const {Schema} = mongoose
const AutoIncrement = require('mongoose-sequence')(mongoose)

const orderSchema = new Schema({
  order_id: {type: Number},
  user_id: {type: String},
  product_id: {type: String},
  qty: {type: Number},
  total: {type: Number},
  status: {type: Number},
},{
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
})

orderSchema.plugin(AutoIncrement,{inc_field: 'order_id'})

module.exports = mongoose.model('order',orderSchema)