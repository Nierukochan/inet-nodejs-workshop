const express = require('express')
const router = express.Router()
const { createOrder, getAllOrders, getOrdersByProduct, cancelOrder, getOrderinCart, getAllCheckedOut } = require('../controller/order')
const { authorize } = require('../middleware/authVerify')

router.post('/products/:id/orders', authorize, createOrder)

router.get('/orders', authorize, getAllOrders)
router.get('/products/:id/orders', authorize, getOrdersByProduct)
router.get('/order-order', authorize, getOrderinCart)
router.get('/orders/checked-out', authorize, getAllCheckedOut)

router.put('/products/:id/orders', authorize, cancelOrder)


module.exports = router