const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const app = express()
const path = require('path')
require('dotenv').config()
require('./db')

app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(cookieParser())
app.use(express.json())
app.use(cors(
  'http://localhost:3001'
))

const authRoutes = require('./routes/auth');
const prodRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')

app.use('/api/v1',authRoutes)
app.use('/api/v1',prodRoutes)
app.use('/api/v1', orderRoutes)
// app.use('/api/v1', productRoutes)

app.listen(3000, () => {
  console.log('Server running on Port 3000');
});