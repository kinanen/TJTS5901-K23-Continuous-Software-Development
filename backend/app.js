const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config()
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const itemsRouter = require('./controllers/items')

// Connecting to the database using mongoose
mongoose.connect(process.env.MONGODB_URL)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })


// Using cors so that the requests from the UI are passed to the server
app.use(cors())
// Using the production build that's created from the React app
// so that it can be accesed from the backend URL
app.use(express.static('build'))

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/items', itemsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

//app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname, './build/index.html'));
//});

app.get('/server-info', (req, res) => {
    res.send('<p>This will (hopefully) show the same server info as the Python file app.py</p>')
})

module.exports = app