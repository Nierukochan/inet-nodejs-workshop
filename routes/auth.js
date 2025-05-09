const express = require('express')
const router = express.Router()
const { register, login, getAllUsers, approveUser, userIsAdmin } = require('../controller/auth')
const { authorize, adminAuthorize } = require('../middleware/authVerify')
const upload = require('../middleware/fileUpload')

router.post('/register', register)
router.post('/login',login)

router.get('/users',authorize, getAllUsers)

router.put('/users/:id/approve', approveUser)
router.put('/users/:id/isadmin', userIsAdmin)

module.exports = router