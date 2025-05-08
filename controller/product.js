const productSchema = require('../schema/productSchema')

const createProduct = async(req, res) => {
  try {
    const { name, qty, type, price} = req.body

    if(!name || !qty || !type || !price) 
      return res.status(400).json({
        status: 400,
        message: 'failed',
        data: null
      })

    const product = await productSchema({
      name: name,
      qty: qty,
      type: type,
      price: price
    })

    await product.save()
    return res.status(200).json({
      status: 200,
      message: 'success',
      data: product
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

const getAllProduct = async(req, res) => {
  try {
    
    const products = await productSchema.find({})

    if(!products) 
      return res.status(404).json({
        status: 404,
        message: 'not found 404',
        data: null
      })

      return res.status(200).json({
        status: 200,
        message: 'success',
        data: [products]
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

const getProduct = async(req,res) => {
  try {

    const {id} = req.params

    // const product = await productSchema.findOne({product_id})
    const product = await productSchema.findById(id)

    if(!product) 
      return res.status(404).json({
        status: 404,
        message: 'not found 404',
        data: null
      })

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: product
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

const editProduct = async(req, res) => {
  try {
    const {id} = req.params
    const { name, qty, type, price} = req.body

    if(!id) 
      return res.status(400).json({
        status: 400,
        message: 'failed',
        data: null
      })

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (qty !== undefined && qty !== null) updateData.qty = qty;
    if (type !== undefined && type !== null) updateData.type = type;
    if (price !== undefined && price !== null) updateData.price = price;

    const product = await productSchema.findByIdAndUpdate(id, updateData,{ new: true })

    if(!product) 
      return res.status(404).json({
        status: 404,
        message: 'not found 404',
        data: null
      })

     return res.status(200).json({
      status: 200,
      message: 'success',
      data: [product]
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

const deleteProduct = async(req, res) => {
  try {
    const {id} = req.params

    const product = await productSchema.findByIdAndDelete(id)

    if(!product)
      return res.status(404).json({
        status: 404,
        message: 'not found 404',
        data: null
      })

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: product
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

module.exports = {createProduct, getAllProduct, getProduct, editProduct, deleteProduct}