const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    // can only sign up with a unique email once
    unique: true
  },
  // password will be transformed with hash transformation
  // example: 'hiep' => 'ijfg' => 'jkgr'
  hashedPassword: {
    type: String,
    required: true
  },
  // gives this token to user once signed in. will generate this later
  token: String
}, {
  timestamps: true,
  toObject: {
    // remove `hashedPassword` field when we call `.toObject`
    transform: (_doc, user) => {
      delete user.hashedPassword
      return user
    }
  }
})

module.exports = mongoose.model('User', userSchema)
