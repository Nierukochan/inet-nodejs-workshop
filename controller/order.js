const orderSchema = require('../schema/orderSchema')
const productSchema = require('../schema/productSchema')
const {sendResponse} = require('../utils/response')

// const createMultipleOrder = async (req, res) => {
//   try {
    
//     const items = req.body

//     if(!Array.isArray(items) || items.length === 0) 
//       return sendResponse(res, 400, 'failed items are null', null)

//     const orders = [];
//     const updatedProducts = []
    
//     const validItems = items.filter(item => {
//       item.id && item.qty
//     })

//   } catch (error) {
//     console.error(error)
//     return sendResponse(res, 500, {msg: 'unknown error', error: error}, null)
//   }
// }

const createOrder = async (req, res) => {
  try {

    const { id } = req.params
    const { qty } = req.body
    const user = req.user
    const userId = user._id;

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

    const product = await productSchema.findById(id)

    return sendResponse(res, 200, 'success', {order: order, product: product})

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getAllOrders = async(req, res) => {
  try { 
    
    const orders = await orderSchema.find({})

    // const product = await proderSchema.findById(orders._id)

    return sendResponse(res, 200, 'success', {order: orders})

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getOrdersByProduct = async(req, res) => {
  try {
    
    const {id} = req.params
    const product = await productSchema.findById(id)
    if(!product)
      return sendResponse(res, 404, {msg:'product not founded',product_id: id} , null)

    const orders = await orderSchema.find({ product_id: id})
    if(!orders) 
      return sendResponse(res, 404, 'not founded', 404)

    return sendResponse(res, 200, 'success', {order: orders})
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

    return sendResponse(res, 200, 'order has been cancelled', {order: order, updatedProduct: product})

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

// const updateProduct = async(req, res) => {
//   try {
//     var {id} = req.params

//     const order = await orderSchema.findByIdAndUpdate(id,{

//     })
//   } catch (error) {
    
//   }
// }

module.exports = { createOrder, getAllOrders, getOrdersByProduct, cancelOrder }