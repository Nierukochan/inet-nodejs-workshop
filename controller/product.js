const productSchema = require('../schema/productSchema')
const {sendResponse} = require('../utils/response')

const createProduct = async(req, res) => {
  try {
    const items = JSON.parse(req.body.items)
    const image = req.files?.map(file => file.filename) || []

    // if(!Array.isArray(image) || image.length === 0)
    //   return sendResponse(res, 400, 'failed missing image', null)

    if (!Array.isArray(items) || items.length === 0) 
      return sendResponse(res, 400, 'failed missing items ', null)
  
    const validItems = items.filter(item =>
      item.name && item.qty && item.type && item.price
    );

    if (validItems.length !== items.length) 
      return sendResponse(res, 400, 'failed valid items', null)

    const itemsWithImage = validItems.map((item, index) => ({
      ...item,
      image: image[index] || null
    }));
  
    const savedProducts = await productSchema.insertMany(itemsWithImage);
    
    return sendResponse(res, 200, `success`, {newProducts: savedProducts})

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getAllProduct = async(req, res) => {
  try {
    
    const products = await productSchema.find({})

    if(!products) 
      return sendResponse(res, 404, 'not founded', 404)

    return sendResponse(res, 200, `success`, {product: products})

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getProduct = async(req,res) => {
  try {

    const {id} = req.params
    if(!id)
      return sendResponse(res, 400, 'failed missing product_id', null)

    const product = await productSchema.findById(id)
    if(!product) 
      return sendResponse(res, 404, 'not founded', null)

    return sendResponse(res, 200, 'success', {product: product})

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const editProduct = async(req, res) => {
  try {
    const {id} = req.params
    const { name, qty, type, price} = req.body

    if(!id) 
      return sendResponse(res, 400, 'failed missing id', null)

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (qty !== undefined && qty !== null) updateData.qty = qty;
    if (type !== undefined && type !== null) updateData.type = type;
    if (price !== undefined && price !== null) updateData.price = price;

    if (req.file) {
      updateData.image = req.file.filename
    }

    const product = await productSchema.findByIdAndUpdate(id, updateData,{ new: true })

    if(!product) 
      return sendResponse(res, 404, 'product not founded', null)

    return sendResponse(res, 200, 'success', {editedProduct: product})
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const deleteProduct = async(req, res) => {
  try {
    const {id} = req.params

    const products = await productSchema.findByIdAndDelete(id)

    if(!products)
      return sendResponse(res, 404, 'not founded', 404)

    return sendResponse(res, 200, 'success', {product: products})
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

module.exports = {createProduct, getAllProduct, getProduct, editProduct, deleteProduct}