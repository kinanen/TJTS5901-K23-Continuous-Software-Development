const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

loginRouter.post('/', async (request, response) => {
  const { email, password, userType } = request.body

  // Check if there exists a user with given email
  const user = await User.findOne({ email })
  // Compare the given password with bcrypt to the users saved passwordHash
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  // If either is incorrect, return code 401 Unauthorized
  if (!(user && passwordCorrect)) {
    logger.warning(`Someone tried to login with incorrect details ${email}`)
    return response.status(401).json({
      error: 'invalid email or password'
    })
  }
  
  // check the user type that the user tried to login with
  // if it matches with their real user type
  if(userType !== user.userType) {
    logger.warning(`Someone tried to login with incorrect user type ${email}`)
    return response.status(401).json({
      error: "Given user type doesn't match user's real type"
    })
  }

  // Create the user to be used for the JWT
  const userForToken = {
    email: user.email,
    userType: user.userType,
    id: user.id,
  }

  // Sign the token with sign and given user
  const token = jwt.sign(
    userForToken,
    process.env.SECRET
  )
  
  logger.notice(`Succesful login ${email}`)
  // Respond with code 200 OK, and send token, email and id back to frontend
  // on successful login
  response
    .status(200)
    .send({ token, email: user.email, firstName: user.firstName, surname: user.surname, userType: user.userType, id: user.id })
})

module.exports = loginRouter