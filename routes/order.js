const express = require('express')
const router = express.Router()
const { createOrder, getAllOrders, getOrdersByProduct } = require('../controller/order')
const { authorize } = require('../middleware/authVerify')

router.post('/products/:id/orders', authorize, createOrder)

router.get('/orders', authorize, getAllOrders)
router.get('/products/:id/orders', authorize, getOrdersByProduct)


module.exports = router