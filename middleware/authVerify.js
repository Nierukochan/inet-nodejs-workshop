const jwt = require('jsonwebtoken')
const userSchema = require('../schema/userSchema')

const authorize = async(req, res, next) => {
  try {
    
    const token = req.cookies['userToken']

    if (!token)
      return res.status(401).json({
        status: 401,
        message: 'unauthorized',
        data: null
      })

    const decoded = await jwt.verify(token, process.env.SECRET_KEY);
    const userId = decoded.userId;
    // console.log(`user_id ${userId}`)

    const user = await userSchema.findById(userId)
    // console.log(`founded ${userId}`)

    if(!user) 
      return res.status(404).json({
        status: 404,
        message: 'not founded 404',
        data: null
      })

    if(user.approved !== 1) 
      return res.status(401).json({
        status: 401,
        message: `Didn't approved`,
        data: null
      })

      req.user = user
      next()
    
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      status: 500,
      message: 'unknown error',
      data: null
    })
  }
}

module.exports = { authorize }