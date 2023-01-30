const path = require('path')
const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv").config()

var corsOptions = {
  origin: process.env.CLIENT_ORIGIN || "http://localhost:3000"
}
app.use(cors(corsOptions))
app.use(express.static(path.join(__dirname, './build')))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './build/index.html'));
});


app.get('/server-info', (req, res) => {
    res.send('<p>This will (hopefully) show the same server info as the Python file app.py</p>')
})

const PORT = 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})