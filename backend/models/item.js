const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
  name: String,
  description: String,
  initial_price: Number,
  seller: 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  highest_bid: Number,
  highest_bidder: 
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  start_date: Date,
  end_date: Date
})

itemSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item