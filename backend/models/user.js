const mongoose = require('mongoose')

// Mongoose Schema for the user with relevant fields
const userSchema = mongoose.Schema({
  email: String,
  firstName: String,
  surname: String,
  userType: String,
  passwordHash: String,
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    }
  ],
})

// Set the Schema to JSON
userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

// Create User model with the Schema
const User = mongoose.model('User', userSchema)

module.exports = User
