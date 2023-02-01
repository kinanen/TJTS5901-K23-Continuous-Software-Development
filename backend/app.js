const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config()
const mongoose = require('mongoose')
const logger = require('./utils/logger')

//mongoose.connect(config.MONGODB_URL)
  //.then(() => {
   // logger.info('connected to MongoDB')
  //})
  //.catch((error) => {
    //logger.error('error connection to MongoDB:', error.message)
  //})

var corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000"
}
app.use(cors(corsOptions))
app.use(express.static('build'))

//app.get('/', (req, res) => {
  //res.sendFile(path.join(__dirname, './build/index.html'));
//});


app.get('/server-info', (req, res) => {
    res.send('<p>This will (hopefully) show the same server info as the Python file app.py</p>')
})

module.exports = app