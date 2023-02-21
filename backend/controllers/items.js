const itemsRouter = require('express').Router()
const Item = require('../models/item')
const User = require('../models/user')
const Upload = require('../models/upload')
const logger = require('../utils/logger')
const multer  = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET endpoint for all the items from Database
itemsRouter.get('/', async (request, response) => {
    const items = await Item
    .find({})
    .find({}).populate('seller', { firstName: 1, surname: 1 })
    
    response.json(items)
})

// GET endpoint for the active items from Database
itemsRouter.get('/active', async (request, response) => {
  const items = await Item
  .find({ status: 'active' })
  .find({ status: 'active' }).populate('seller', { firstName: 1, surname: 1 })
  
  response.json(items)
})

// POST endpoint for the new item to Database
itemsRouter.post('/', async (request, response) => {
  if (!request.user) {
    logger.warning("Someone tried to add an item with no token or invalid token")
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // Get the user from the token via the userExtractor middleware
  const user = request.user

  // check if the user has the user type "seller" to be allowed to sell items
  if(user.userType === "buyer") {
    return response.status(403).json({ error: "user doesn't have the right user type to sell items" })
  }
  const body = request.body

  startDate = new Date()
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
    startDate: startDate,
    endDate: endDate.setHours(endDate.getHours() + 24),
    zipcode: body.zipcode,
    currency: body.currency,
    photo: null,
    status: 'active'
  })
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

// PUT endpoint for uploading a photo and link it with the correct item
itemsRouter.put('/photo/:id', upload.single("file"), async (request, response) => {
  const item = await Item.findById(request.params.id)
  // if there's no item found, respond with code 404 Not Found
  if(!item) {
    logger.error("Could not find an item with given id")
    return response.status(404).json({ error: "item not found" })
  }

  // object for the photo, put the item id to item field
  let imageUploadObject = {
    item: item._id,
    file: {
      data: request.file.buffer,
      contentType: request.file.mimetype
    }
  }
  // object formed with Upload schema
  const uploadObject = new Upload(imageUploadObject);
  // save the photo id to item
  item.photo = uploadObject._id
  // save the altered item to database
  await item.save()
  // saving the object into the database
  const uploadProcess = await uploadObject.save();

  // respond with code 200 OK after all the operations and send the photo back in JSON form
  response.status(200).json(uploadProcess)
})

// GET endpoint for single photo
itemsRouter.get('/photo/:id', async (request, response) => {
  const photo = await Upload.findById(request.params.id)

  // if no photo can be found
  if(!photo) {
    logger.error("Could not find a photo with given id")
    // respond with code 404 Not Found
    return response.status(404).json({ error: "no such photo found with id" })
  }

  // otherwise repond with code 200 OK and the photo
  response.status(200).json(photo)
})

// GET endpoint for a single item from Database
itemsRouter.get('/:id', async (request, response) => {
  const item = await Item.findById(request.params.id)
  // if there's no item found, respond with code 404 Not Found
  if(!item) {
    logger.error("Could not find an item with given id")
    return response.status(404).json({ error: "item not found" })
  }
  
  // respond with code 200 OK if the item can be found
  response.status(200).json(item)
})

// PUT endpoint for updating the item when user bids on it
itemsRouter.put('/:id', async (request, response) => {
  // if user can't be found respond with code 401 Unauthorized
  if (!request.user) {
    logger.warning("Someone tried to bid on an item without token or with an invalid one")
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  // new bid sent from frontend
  const bid  = request.body.highestBid
  // get the user that bid on the item
  const user = request.user
  // if the user has user type for seller, they are not allowed to bid on items
  if(user.userType === "seller") {
    return response.status(403).json({ error: "user type is seller, not allowed to bid" })
  }
  // get the item from database to compare it with the bid
  const item = await Item.findById(request.params.id)

  /*
  // check if the bidder's id matches with the item's seller
  if(user._id.toString() === item.seller.toString()) {
    return response.status(403).json({ error: "seller can't bid on their own item" })
  }

  // check if the user is already the highest bidder on the item
  if(item.highestBidder.toString() === user._id.toString()) {
    logger.warning(`User ${user.email} tried to bid on the same item ${item.id} again while being the highest bidder`)
    return response.status(403).json({ error: "same user cannot bid again while being highest bidder" })
  }*/
  
  // If the bid sent is lower than the highest bid or the initial price
  // return with status code 409 Conflict
  if((bid <= item.highestBid) || (bid <= item.initialPrice)) {
    logger.warning("user entered a bid lower than expected")
    return response.status(409).json({ error: "bid was lower than expected" })
  }

  // set the item's highestBid to the bid sent
  item.highestBid = bid
  // set the item's highest bidder to be the logged in user's id
  item.highestBidder = user._id

  // update the item with the highest bid and populate the highestBidder field 
  // with the user's name
  const updatedItem = await Item
    .findByIdAndUpdate(
      request.params.id,
      item,
      { new: true }
    ).populate('highestBidder', { firstName: 1, surname: 1 })

  // respond with code 200 OK and send the updated item in the response
  logger.notice(`User ${user.email} bid on item ${item.id}`)
  response.status(200).json(updatedItem)
})

// PUT endpoint to update the item's status
itemsRouter.put('/status/:id', async (request, response) => {
  // get the item from database to compare it with the bid
  const item = await Item.findById(request.params.id)

  // set the item's status to one from request
  item.status = request.body.status
  
  // update the item on database with new status
  const updatedItem = await Item
    .findByIdAndUpdate(
      request.params.id,
      item,
      { new: true }
    )

  response.status(200).json(updatedItem)
})

itemsRouter.delete('/:id', async (request, response) => {
  const itemToDelete = Item.findById(request.params.id)

  if(!itemToDelete) {
    return response.status(404).json({ error: "no item found with given id" })
  }

  await Item.findByIdAndDelete(request.params.id)

  response.status(204).end()
})

module.exports = itemsRouter
