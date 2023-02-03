const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({}).populate('items')

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { email, username, password } = request.body

  const existingEmail = await User.findOne({ email })
  const existingusername = await User.findOne({ username })
  if (existingEmail || existingusername) {
    return response.status(400).json({
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
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    email,
    username,
    passwordHash,
  })

  const savedUser = await user.save()

  logger.info("New user registered")
  response.status(201).json(savedUser)
})

module.exports = usersRouter