const express = require('express')
const router = express.Router()
const { register, login, getAllUsers, approveUser } = require('../controller/auth')
const { authorize } = require('../middleware/authVerify')

router.post('/register', register)
router.post('/login',login)

router.get('/getAllUsers',getAllUsers)

router.put('/users/:id/approve', authorize, approveUser)

module.exports = router