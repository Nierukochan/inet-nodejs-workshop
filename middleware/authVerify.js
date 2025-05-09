const jwt = require('jsonwebtoken')
const userSchema = require('../schema/userSchema')
const {sendResponse} = require('../utils/response')

const authorize = async(req, res, next) => {
  try {
    
    const token = req.cookies['userToken']

    if (!token)
      return sendResponse(res, 401, `unauthorize`, null)

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;
    // console.log(`user_id ${userId}`)

    const user = await userSchema.findById(userId)
    // console.log(`founded ${userId}`)

    if(!user) 
      return sendResponse(res, 404, `not founded user`, null)

    if(!user.approved) 
      return sendResponse(res, 401, `Didn't approved fire`, null)

      req.user = user
      next()
    
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, `unknown error`, null)
  }
}


const adminAuthorize = async(req, res, next) => {
  try {
    
    const token = req.cookies['userToken']
    if(!token) return res.status(401).json({
      status: 401,
      message: 'unauthorized (no token)',
      data: null
    })

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await userSchema.findById(decoded.userId)
    if(!user) return res.status(404).json({
      status: 404,
      message: 'not founded 404',
      data: null
    })

    if(!user.isAdmin) return res.status(401).json({
      status: 401,
      message: 'unauthorized (not admin)',
      data: null
    })

    req.user = user
    next()

  } catch (error) {
    
  }
}

module.exports = { authorize }