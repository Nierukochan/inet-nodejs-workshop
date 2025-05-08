const orderSchema = require('../schema/orderSchema')
const productSchema = require('../schema/productSchema')
const jwt = require('jsonwebtoken')

const createOrder = async (req, res) => {
  try {

    const { id } = req.params
    const { qty } = req.body
    const user = req.user
    const userId = user._id;
    // console.log(userId)
   

    const findProduct = await productSchema.findById(id)
    if (!findProduct)
      return res.status(404).json({
        status: 404,
        message: 'not found 404',
        data: null
      })

    if(qty > findProduct.qty) 
      return res.status(400).json({
        status: 400,
        message: 'failed (qty > stock)',
        data: null
      })

    const total = findProduct.price * qty
    // console.log(total)
    // console.log(token)

    const order = await orderSchema.create({
      product_id: id,
      user_id: userId,
      qty: qty,
      total: total,
      status: 0,
    })

    await order.save()

    const updateStock = await productSchema.findByIdAndUpdate(id,{
      qty: findProduct.qty - qty
    })

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: {}
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'unknown error',
      data: null
    })
  }
}

const getAllOrders = async(req, res) => {
  try { 
    
    const orders = await orderSchema.find({})

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: [orders]
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'unknown error',
      data: null
    })
  }
}

const getOrdersByProduct = async(req, res) => {
  try {
    
    const {id} = req.params

    const orders = await orderSchema.find({ product_id: id})

    if(!orders) 
      return res.status(404).json({
        status: 404,
        message: 'not founded 404',
        data: null
      })

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: [orders]
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'unknown error',
      data: null
    })
  }
}

module.exports = { createOrder, getAllOrders, getOrdersByProduct }