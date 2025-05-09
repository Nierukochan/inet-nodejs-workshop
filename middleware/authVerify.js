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
      return sendResponse(res, 404, `user not founded`, null)
    //http://localhost:3000/api/v1/users/681cc3f9d96fa51172987509/approve
    if(!user.approved) 
      return sendResponse(res, 401, {msg:`didn't approved`, url:`http://localhost:3000/api/v1/users/${userId}/approve` }, null)

      req.user = user
      next()
    
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500,{msg: 'unknown error', error: error}, null)
  }
}


const adminAuthorize = async(req, res, next) => {
  try {
    
    const token = req.cookies['userToken']
    if(!token) 
      return sendResponse(res, 401, `unauthorize (token invalid)`, null)

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);

    const user = await userSchema.findById(decoded.userId)
    if(!user) 
      return sendResponse(res, 404, `user not founded`, null)

    if(!user.isAdmin) 
      return sendResponse(res, 401, `unauthorize (not admin)`, null)

    req.user = user
    next()

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, {msg: 'unknown error', error: error}, null)
  }
}

module.exports = { authorize, adminAuthorize }