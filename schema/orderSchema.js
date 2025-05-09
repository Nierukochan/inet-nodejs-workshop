const mongoose = require('mongoose')
const {Schema} = mongoose

const orderSchema = new Schema({
  user_id: {type: String},
  product_id: {type: String},
  qty: {type: Number},
  total: {type: Number},
  status:
   {type: String,
    enum: ['in_cart', 'waiting_purchase', 'done','cancel'], 
    default: 'in_cart'
  },
},{
  timestamps: { 
    createdAt: 'created_at', 
    updatedAt: 'updated_at' 
  }
})

module.exports = mongoose.model('order',orderSchema)