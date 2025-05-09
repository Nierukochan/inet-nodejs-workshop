const express = require('express')
const router = express.Router()
const { register, login, getAllUsers, approveUser } = require('../controller/auth')
const { authorize } = require('../middleware/authVerify')

router.post('/register', register)
router.post('/login',login)

router.get('/users',getAllUsers)

router.put('/users/:id/approve', approveUser)

module.exports = router