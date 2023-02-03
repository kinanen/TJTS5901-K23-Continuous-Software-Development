const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

// Get all the registered users
usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('items')

  response.json(users)
})

// Register user with the given data from the frontend
usersRouter.post('/', async (request, response) => {
  const { email, username, password } = request.body

  // Check if user already exists with email
  const existingEmail = await User.findOne({ email })
  // Check if user already exists with username
  const existingusername = await User.findOne({ username })
  // If there is either email or username already in use, respond with code 409 Conflict
  if (existingEmail || existingusername) {
    return response.status(409).json({
      error: 'email and username must be unique'
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
    username,
    passwordHash,
  })

  // Save user to database
  const savedUser = await user.save()

  // Log the event
  logger.info(`New user ${user.username} registered`)
  // Respond with code 201 Created and send the user in JSON form
  response.status(201).json(savedUser)
})

module.exports = usersRouter
