const orderSchema = require('../schema/orderSchema')
const productSchema = require('../schema/productSchema')
const {sendResponse} = require('../utils/response')
const jwt = require('jsonwebtoken')

const createOrder = async (req, res) => {
  try {

    const { id } = req.params
    const { qty } = req.body
    const user = req.user
    const userId = user._id;
    
    const items = req.body;
      
    // if (!Array.isArray(items) || items.length === 0) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'failed (missing items)',
    //     data: null
    //   });
    // }
  
    // const validItems = items.filter(item =>
    //   item.id && item.userId && item.qty && item.price
    // );
  
    // if (validItems.length !== items.length) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: 'failed (missing field)',
    //     data: null
    //   });
    // }
  
    // const savedProducts = await orderSchema.insertMany(validItems)

    const findProduct = await productSchema.findById(id)
    if (!findProduct)
      return sendResponse(res, 404, 'not founded 404', null)

    if(qty > findProduct.qty) 
      return sendResponse(res, 400, 'failed (qty > stock)', null)

    const total = findProduct.price * qty
    // console.log(total)
    // console.log(token)

    const order = await orderSchema.create({
      product_id: id,
      user_id: userId,
      qty: qty,
      total: total,
    })

    await order.save()

    const updateStock = await productSchema.findByIdAndUpdate(id,{
      qty: findProduct.qty - qty
    })

    return sendResponse(res, 200, 'success', null)

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getAllOrders = async(req, res) => {
  try { 
    
    const orders = await orderSchema.find({})

    return sendResponse(res, 200, 'order has been cancelled', {order})

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getOrdersByProduct = async(req, res) => {
  try {
    
    const {id} = req.params
    const orders = await orderSchema.find({ product_id: id})

    if(!orders) 
      return sendResponse(res, 404, 'not founded', 404)

    return sendResponse(res, 200, 'order has been cancelled', {orders})
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const cancelOrder = async(req, res) => {
  try {
    var {id} = req.params

    const order = await orderSchema.findByIdAndUpdate(id, {
      status: 'cancel'
    })
    if(!order)
      return sendResponse(res, 404, 'order not founded', null)

    const productQty = await productSchema.findById(order.product_id)
    // console.log(productQty.qty)
    const product = await productSchema.findByIdAndUpdate(order.product_id,{
      qty: productQty.qty + order.qty 
    })

    return sendResponse(res, 200, 'order has been cancelled', {order})

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

module.exports = { createOrder, getAllOrders, getOrdersByProduct, cancelOrder }