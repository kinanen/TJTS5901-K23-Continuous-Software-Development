const express = require('express')
const app = express()

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})


app.get('/server-info', (req, res) => {
    res.send('<p>This will show the same server info as the Python file app.py</p>')
})

const PORT = 5001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})