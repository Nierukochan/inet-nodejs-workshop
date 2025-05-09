const userSchema = require('../schema/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const {sendResponse} = require('../utils/response')

const register = async(req,res) => {
  try {

    const {username, password} = req.body
    const hashedpassword = await bcrypt.hash(password, 10)

    const finduser = await userSchema.findOne({username})

    if(finduser) 
      return sendResponse(res, 409, 'username already exists', null)

    const users = await userSchema({
      username: username,
      password: hashedpassword,
    })

    await users.save()
    return sendResponse(res, 200, 'success', null)

  } catch (error) {
    console.log(error);
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const login = async(req,res) => {
  try {
    const {username, password} = req.body

    if(!username || !password) 
      return sendResponse(res, 400, 'failed', null)

    const user = await userSchema.findOne({username})

    if(!user) 
      return sendResponse(res, 404, 'not founded', null)

    const comparedPassword = await bcrypt.compare(password, user.password)
    if(!comparedPassword) 
      return res.status(401).json({
        status: 401,
        message: 'invalid username || password',
        data: []
      })
    
    const token = jwt.sign({userId: user._id},process.env.SECRET_KEY,{expiresIn: '1h'})

    // res.setHeader('Set-Cookie', `userToken=${token}; HttpOnly; Max-Age=3600; Path=/; SameSite=Lax`);

      res.cookie('userToken', token, {
        httpOnly: true,
        secure: false, 
        // sameSite: 'Lax',
        // maxAge: 3600000 
      });
    
    return res.status(200).json({
      status: 200,
      message: 'success',
      data: user.username
    })

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const getAllUsers = async(req, res) => {
  try {
    
    const products = await userSchema.find({}).select('-password')

    if(!products) 
      return sendResponse(res, 404, 'not founded', null)

      // const { password: hashedPassword, ...userWithoutPassword } = products

      return res.status(200).json({
        status: 200,
        message: 'success',
        data: [products]
      })
      
  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

const approveUser = async(req, res) => {
  try {
    const {id} = req.params

    const users = await userSchema.findByIdAndUpdate(id,{
      approved: true
    })

    if(!users) 
      return sendResponse(res, 404, 'not founded', null)

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: {}
    })

  } catch (error) {
    console.error(error)
    return sendResponse(res, 500, 'unknown error', null)
  }
}

module.exports = { register, login, getAllUsers, approveUser }