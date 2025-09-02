const orderSchema = require('../schema/orderSchema')
const productSchema = require('../schema/productSchema')
const orderItemSchema = require('../schema/orderItemSchema')
const { sendResponse } = require('../utils/response')

const createOrder = async (req, res) => {
  try {

    const { id } = req.params
    const { qty } = req.body
    const user = req.user
    const userId = user._id;

    const findProduct = await productSchema.findById(id)
    if (!findProduct)
      return sendResponse(res, 404, 'not founded 404', null)

    if (qty > findProduct.qty)
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
    console.log(order._id)

    let orderItem = await orderItemSchema.findOne({ user_id: userId, status: 'active' });

    if (orderItem) {
      // Add order to existing orderItem
      orderItem.items.push({ order_id: order._id });
      orderItem.total += order.total
      orderItem.user_id = userId
    } else {
      
      orderItem = new orderItemSchema({
        user_id: userId,
        items: [{ order_id: order._id }],
        total: order.total
      });
    }

    await orderItem.save()

    const updateStock = await productSchema.findByIdAndUpdate(id, {
      qty: findProduct.qty - qty
    })

    const product = await productSchema.findById(id)

    return sendResponse(res, 200, 'success', { order: order, product: product })

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getAllOrders = async (req, res) => {
  try {

    const orders = await orderSchema.find({})

    // const product = await proderSchema.findById(orders._id)

    return sendResponse(res, 200, 'success', { order: orders })

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getOrdersByProduct = async (req, res) => {
  try {

    const { id } = req.params
    const product = await productSchema.findById(id)
    if (!product)
      return sendResponse(res, 404, { msg: 'product not founded', product_id: id }, null)

    const orders = await orderSchema.find({ product_id: id })
    if (!orders)
      return sendResponse(res, 404, 'not founded', 404)

    return sendResponse(res, 200, 'success', { order: orders })
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const cancelOrder = async (req, res) => {
  try {
    var { id } = req.params

    const order = await orderSchema.findByIdAndUpdate(id, {
      status: 'cancel'
    })
    if (!order)
      return sendResponse(res, 404, 'order not founded', null)

    const productQty = await productSchema.findById(order.product_id)
    // console.log(productQty.qty)
    const product = await productSchema.findByIdAndUpdate(order.product_id, {
      qty: productQty.qty + order.qty
    })

    return sendResponse(res, 200, 'order has been cancelled', { order: order, updatedProduct: product })

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getOrderinCart = async(req, res) => {
 try {
    const user = req.user
    const userId = user._id
    const orderItem = await orderItemSchema.findOne({ user_id: userId, status: 'active' });

    if (!orderItem) {
      return sendResponse(res, 404, 'No active cart found', null);
    }

    const orderIds = orderItem.items.map(item => item.order_id);

    const orders = await orderSchema.find({ _id: { $in: orderIds } });

    const productIds = orders.map(order => order.product_id)

    const products = await productSchema.find({_id: { $in: productIds}})

    return sendResponse(res, 200, 'Orders in cart fetched successfully', {
      cart: orderItem,
      orders,
      products
    });

  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, 'Unknown error', null);
  }
}

const getAllCheckedOut = async(req, res) => {
  try {
    
    let orderItems = await orderItemSchema.find({ status: 'active' }); //checked_out

    if (!orderItems || orderItems.length === 0) {
      return sendResponse(res, 404, 'No active cart items found', null);
    }

    const orderIds = orderItems.flatMap(item =>
      item.items.map(i => i.order_id)
    );

    // Step 3: Fetch orders by orderIds
    const orders = await orderSchema.find({ _id: { $in: orderIds } });

    // Step 4: Extract product_ids from orders
    const productIds = orders.map(order => order.product_id);

    // Step 5: Fetch products
    const products = await productSchema.find({ _id: { $in: productIds } });

    return sendResponse(res, 200, 'Orders in cart fetched successfully', {
      cart: orderItems,
      orders,
      products
    });

  } catch (error) {
      console.error(error)
     return sendResponse(res, 500, 'Unknown error', error);
  }
}


module.exports = { createOrder, getAllOrders, getOrdersByProduct, cancelOrder, getOrderinCart, getAllCheckedOut }