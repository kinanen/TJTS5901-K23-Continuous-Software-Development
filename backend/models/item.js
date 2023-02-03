const mongoose = require('mongoose')

// The MongoDB Schema for items
const itemSchema = mongoose.Schema({
  name: String,
  description: String,
  initialPrice: Number,
  seller: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  highestBid: Number,
  highestBidder: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  startDate: Date,
  endDate: Date
})

// Transfer the Schema to JSON
itemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

// Create Item model from the Schema
const Item = mongoose.model('Item', itemSchema)

module.exports = Item
