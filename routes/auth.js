const express = require('express')
const router = express.Router()
const { register, login, getAllUsers, approveUser, userIsAdmin } = require('../controller/auth')
const { authorize } = require('../middleware/authVerify')

router.post('/register', register)
router.post('/login',login)

router.get('/users',authorize, getAllUsers)

router.put('/users/:id/approve', approveUser)
router.put('/users/:id/isadmin', userIsAdmin)

module.exports = router