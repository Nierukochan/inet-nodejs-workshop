const express = require('express')
const router = express.Router()
const {createProduct, getAllProduct, getProduct, editProduct, deleteProduct} = require('../controller/product')
const { authorize } = require('../middleware/authVerify')
const upload = require('../middleware/fileUpload')

router.post('/products', authorize, upload.array('image'), createProduct)

router.get('/products', authorize, getAllProduct)
router.get('/products/:id', authorize, getProduct)

router.put('/products/:id', authorize, editProduct)

router.delete('/products/:id', authorize, deleteProduct)

module.exports = router