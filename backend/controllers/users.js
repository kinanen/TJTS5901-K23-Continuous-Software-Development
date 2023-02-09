const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

// Get all the registered users, only works for operator-user types
usersRouter.get('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  if(user.userType !== "operator")
  {
    return response.status(403).json({ error: 'insufficient authorization' })
  }
  const users = await User
    .find({})
    .find({}).populate('items')

  response.json(users)
})

// Register user with the given data from the frontend
usersRouter.post('/', async (request, response) => {
  const { email, firstName, surname, userType, password } = request.body

  // Check if user already exists with email
  const existingEmail = await User.findOne({ email })
  // If there is either email or username already in use, respond with code 409 Conflict
  if (existingEmail) {
    logger.error(`Someone tried to register new account with same account - ${email}`)
    return response.status(409).json({
      error: 'email must be unique'
    })
  }

  if (!(email.includes('@'))) {
    return response.status(400).json({
      error: 'email must be the right format'
    })
  }

  if (password.length < 8) {
    return response.status(400).json({
      error: 'password must be at least 8 characters'
    })
  }

  const saltRounds = 10
  // Make a hash of the given password
  const passwordHash = await bcrypt.hash(password, saltRounds)

  // Create the user with given data
  const user = new User({
    email,
    firstName,
    surname,
    userType,
    passwordHash,
  })

  // Save user to database
  const savedUser = await user.save()

  // Log the event
  logger.notice(`New user ${user.email}, ${user.firstName} ${user.surname} - ${user.userType} registered`)
  // Respond with code 201 Created and send the user in JSON form
  response.status(201).json(savedUser)
})

usersRouter.get('/:id', async (request, response) => {
  user = request.user

  response.status(200).json(user)
}) 

module.exports = usersRouter
