const express = require('express')
const router = express.Router()
const { register, login, getAllUsers, approveUser } = require('../controller/auth')

router.post('/register', register)
router.post('/login',login)

router.get('/getAllUsers',getAllUsers)

router.put('/users/:id/approve', approveUser)

module.exports = router