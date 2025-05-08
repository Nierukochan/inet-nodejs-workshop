const userSchema = require('../schema/userSchema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const register = async(req,res) => {
  try {

    const {username, password} = req.body
    const hashedpassword = await bcrypt.hash(password, 10)

    const finduser = await userSchema.findOne({username})

    if(finduser) 
      return res.status(409).json({
        status: 409,
        message: 'username already exists',
        data: []
      }) 

    const users = await userSchema({
      username: username,
      password: hashedpassword,
      approved: 0
    })

    await users.save()
    res.status(200).json({
      status:200,
      message:'success',
      data: users
    })

  } catch (error) {
    console.log(error);
    
    res.status(500).json({
      status:500,
      message:'unknown error',
      data: null
    })
  }
}

const login = async(req,res) => {
  try {
    const {username, password} = req.body

    if(!username || !password) 
      return res.status(200).json({
      status:400,
      message:'failed',
      data: []
    })

    const user = await userSchema.findOne({username})

    if(!user) 
      return res.status(404).json({
        status: 404,
        message: 'not found 404',
        data: []
      }) 

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
    return res.status(500).json({
      status: 500,
      message: 'unknown error',
      data: null
    })
  }
}

const getAllUsers = async(req, res) => {
  try {
    
    const products = await userSchema.find({}).select('-password')

    if(!products) 
      return res.status(404).json({
        status: 404,
        message: 'not found 404',
        data: null
      })

      // const { password: hashedPassword, ...userWithoutPassword } = products

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

const approveUser = async(req, res) => {
  try {
    const {id} = req.params
    const approved = 1

    const users = await userSchema.findByIdAndUpdate(id,{
      approved: approved
    })

    if(!users) 
      return res.status(404).json({
        status: 404,
        message: 'not found 404',
        data: null
      })

    return res.status(200).json({
      status: 200,
      message: 'success',
      data: {}
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

module.exports = { register, login, getAllUsers, approveUser }