// Mongoose is a ODM ( Object-Docment Mapper). good at converting Objects (Js) and Documents (MongoDb). stored as BSON (similar to JSON)
const mongoose = require('mongoose')

// schema for tx
const treatmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  tooth: {
    type: String,
    required: true
  },
  radiographs: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  // relationship between Users and Events using references (not subDOC)
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  // toObject is the function that runs when Mongoose is converting from a MongoDB document to a JS object (retrieving from DB)
  toObject: {},
  // toJSON is the function that runs when Mongoose is converting from a JS object to a MongoDB document (saving to DB)
  toJSON: {}
})

// export, converting the schema to a model
module.exports = mongoose.model('Treatment', treatmentSchema)
