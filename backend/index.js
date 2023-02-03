const app = require('./app')
const logger = require('./utils/logger')

const PORT = 5001
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`)
})