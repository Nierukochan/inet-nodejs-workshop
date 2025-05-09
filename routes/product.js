const express = require('express')
const router = express.Router()
const {createProduct, getAllProduct, getProduct, editProduct, deleteProduct} = require('../controller/product')
const { authorize } = require('../middleware/authVerify')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, './public/images')
  },filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`)
  }
})

const upload = multer({storage})

router.post('/products', authorize, upload.array('image'), createProduct)

router.get('/products', authorize, getAllProduct)
router.get('/products/:id', authorize, getProduct)

router.put('/products/:id', authorize, editProduct)

router.delete('/products/:id', authorize, deleteProduct)

module.exports = router