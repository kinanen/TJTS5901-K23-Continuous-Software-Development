const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

// GET all the registered users, only works for operator-user types
usersRouter.get('/', async (request, response) => {
  if (!request.user) {
    logger.warn("Someone tried to access all users list without login")
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user
  // if the user's user type isn't operator, return with code 403 Forbidden
  /*if(user.userType !== "operator") {
    logger.warn(`Someone tried to access all users list without proper authorization ${user.email} - ${user.userType}`)
    return response.status(403).json({ error: 'insufficient authorization' })
  }*/
  // if everything is OK, retrieve all the users from database
  const users = await User
    .find({})
    .find({}).populate('items')

  response.json(users)
})

// Register user with the given data from the frontend with POST
usersRouter.post('/', async (request, response) => {
  const { email, firstName, surname, userType, password } = request.body

  // Check if user already exists with email
  const existingEmail = await User.findOne({ email })
  // If there is either email or username already in use, respond with code 409 Conflict
  if (existingEmail) {
    logger.warn(`Someone tried to register new account with same account - ${email}`)
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
  logger.notice(`New user ${user.email}, ${user.firstName} ${user.surname} - ${user.userType}, registered`)
  // Respond with code 201 Created and send the user in JSON form
  response.status(201).json(savedUser)
})

// GET a single user's info
usersRouter.get('/:id', async (request, response) => {
  // if user can't be found with the given token or no token was given
  if (!request.user) {
    logger.warn("Someone tried to get user info with no token or invalid one")
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const user = request.user

  const userFromParams = await User.findById(request.params.id)
  
  // if no user can be found with the given id
  // return with code 404 Not Found
  if(userFromParams === null) {
    logger.error("No user found with given ID")
    return response.status(404).json({ error: "no user found with given id" })
  }

  if((user.userType !== "operator") && (user.id !== userFromParams.id)) {
    return response.status(403).json({ error: "user tried to access other user's info without proper authorization" })
  }

  // otherwise respond with code 200 OK and send the user info
  response.status(200).json(user)
}) 

module.exports = usersRouter
