require('dotenv').config()

const WEBSITES_PORT = process.env.WEBSITES_PORT
const MONGODB_URL = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URL
  : process.env.MONGODB_URL


module.exports = {
  MONGODB_URL,
  WEBSITES_PORT
}