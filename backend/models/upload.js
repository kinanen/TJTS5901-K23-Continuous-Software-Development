const mongoose = require("mongoose");

// The MongoDB Schema for photo upload
const uploadSchema = new mongoose.Schema({
  item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
  },
  file: {
    data: Buffer,
    contentType: String,
  }
});

// Transfer the Schema to JSON
uploadSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  }
})

// create Upload model from the schema
const Upload = mongoose.model('Upload', uploadSchema);

module.exports = Upload