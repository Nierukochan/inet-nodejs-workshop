const express = require('express')
const router = express.Router()
const {createProduct, getAllProduct, getProduct, editProduct, deleteProduct} = require('../controller/product')
const { authorize } = require('../middleware/authVerify')
const upload = require('../middleware/fileUpload')

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images'); // Change this path if needed
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const uploadSingle = multer({ storage })

router.post('/products',authorize, upload.array('image'), createProduct)

router.get('/products',authorize, getAllProduct)
router.get('/products/:id', authorize, getProduct)

router.put('/products/:id', authorize, upload.single('image'), editProduct)

router.delete('/products/:id', authorize, deleteProduct)

module.exports = router