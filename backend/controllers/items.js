const itemsRouter = require('express').Router()
const Item = require('../models/item')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { request, response } = require('../app')
const { findByIdAndUpdate } = require('../models/item')

// Get all the items from Database
itemsRouter.get('/', async (request, response) => {
    const items = await Item
    .find({})
    .find({}).populate('seller', { firstName: 1, surname: 1 })
    
    response.json(items)
})

// Post the new item to Database
itemsRouter.post('/', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Get the user from the token via the userExtractor middleware
  const user = request.user
  const body = request.body

  endDate = new Date()
    
  // Create new Item with the data from the frontend and found user
  const item = new Item({
    name: body.name,
    model: body.model,
    description: body.description,
    category: body.category,
    condition: body.condition,
    initialPrice: body.initialPrice,
    seller: user._id,
    highestBid: null,
    highestBidder: null,
    startDate: new Date(),
    endDate: endDate.setHours(startDate.getHours() + 24),
    zipcode: body.zipcode,
    currency: body.currency
  })

  console.log(item)
  
  // Save the item to Database and put it to constant
  const savedItem = await item.save()
  // Save the item to users items in sale
  user.items = user.items.concat(savedItem._id)
  // Save the modified user to Database
  await user.save()
  const itemToReturn = await Item
    .findById(savedItem._id)
    .populate('seller', { email: 1 })
  // Respond with code 201 Created, and send the Item in JSON form to frontend
  response.status(201).json(itemToReturn)
})

itemsRouter.get('/:id', async (request, response) => {
  const item = await Item.findById(request.params.id)

  response.status(200).json(item)
})

itemsRouter.put('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const newItem = request.body
  const user = request.user
  const item = await Item.findById(request.params.id)

  if(!(newItem.highestBid > item.highestBid) || (newItem.highestBid < item.initialPrice)) {
    return response.status(409).json({ error: "bid was lower than expected" })
  }

  newItem.highestBidder = user.id

  const updatedItem = await Item
    .findByIdAndUpdate(
      request.params.id,
      newItem
    ).populate('highestBidder', { firstName: 1, surname: 1 })

    response.json(updatedItem)
})

module.exports = itemsRouter
