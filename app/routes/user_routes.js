const express = require('express')
// jsonwebtoken docs: https://github.com/auth0/node-jsonwebtoken
// generate random string
const crypto = require('crypto')
// Passport docs: http://www.passportjs.org/docs/
// check/authenticate tokens
const passport = require('passport')
// bcrypt docs: https://github.com/kelektiv/node.bcrypt.js
// encrypting/checking passwords
const bcrypt = require('bcrypt')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

// pull in error types and the logic to handle them and set status codes
// require error handling 'middelwares'
const errors = require('../../lib/custom_errors')
const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

// require user model
const User = require('../models/user')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// SIGN UP
// POST /sign-up
router.post('/sign-up', (req, res, next) => {
  // get data from request.
  /* data will be in format:
  {
    credential: {
      email:' hiep@duong.com
      password: 'hiep'
      password_confirmation: 'duong'
    }
  }
  */
  const credentials = req.body.credentials
  // start a promise chain, so that any errors will pass to `handle`
  Promise.resolve()
  // reject any requests where `credentials.password` is not present, or where
  // the password is an empty string.
  // or password does not match password confirmation
    .then(() => {
      if (!credentials || !credentials.password || credentials.password !== credentials.password_confirmation) {
        throw new BadParamsError()
      }
    })
  // generate a hash from the provided password, returning a promise
    .then(() => bcrypt.hash(credentials.password, bcryptSaltRounds))
    .then(hash => {
      // return necessary params to create a user
      const user = {
        email: credentials.email,
        hashedPassword: hash
      }
      // create user with provided email and hashed password
      return User.create(user)
    })

  // send the new user object back with status 201, but `hashedPassword`
  // won't be send because of the `transform` in the User model
    .then((user) => res.status(201).json({ user: user.toObject() }))
  // pass any errors along to the error handler
    .catch(next)
})

// SIGN IN
// POST /sign-in
router.post('/sign-in', (req, res, next) => {
  /* data will be in format:
  {
    credential: {
      email:' hiep@duong.com
      password: 'hiep'
    }
  }
  */
  const pw = req.body.credentials.password
  // declare a user variable to store the found user so we can access it at each save of the Promise chain without returning it each time
  let user
  // find a user based on the email that was passed. every email is unique
  User.findOne({ email: req.body.credentials.email })
    .then((record) => {
      // if we didn't find a user with that email, send 401
      if (!record) {
        throw new BadCredentialsError()
      }
      // save the found user outside the promise chain
      user = record
      // `bcrypt.compare` will return true if the result of hashing `pw`
      // is exactly equal to the hashed password stored in the DB
      return bcrypt.compare(pw, user.hashedPassword)
    })
    .then((correctPassword) => {
      // if the passwords matched
      if (correctPassword) {
        // the token will be a 16 byte random hex string
        const token = crypto.randomBytes(16).toString('hex')
        // attach the token to the user object
        user.token = token
        // save the token to the DB as a property on user
        return user.save()
      } else {
        // throw an error to trigger the error handler and end the promise chain
        // this will send back 401 and a message about sending wrong parameters
        throw new BadCredentialsError()
      }
    })
    .then((user) => {
      // return status 201, the email, and the new token
      // again filtering out the hashedPassword
      res.status(201).json({ user: user.toObject() })
    })
    .catch(next)
})

// CHANGE password
// PATCH /change-password= router.METHOD(PATH, MIDDLEWARE, CALLBACK)
// The MIDDLEWARE will only run when the server receives a request to this endpoint specifically
// requireToken is a callback function
router.patch('/change-password', requireToken, (req, res, next) => {
  // requireToken will run passport.authenticate
  // passport will store the authenticated user on req.user
  // declare a user variable to store the found user so we can access it at each save of the Promise chain without returning it each time
  let user
  // `req.user` will be determined by decoding the token payload
  User.findById(req.user.id)
  // save user outside the promise chain
    .then((record) => {
      user = record
    })
  // check that the old password is correct. compare if the old pw matches the hashedPw
    .then(() => bcrypt.compare(req.body.password.old, user.hashedPassword))
  // `correctPassword` will be true if hashing the old password ends up the
  // same as `user.hashedPassword`
    .then((correctPassword) => {
      // throw an error if the new password is missing, an empty string,
      // or the old password was wrong
      if (!req.body.password.new || !correctPassword) {
        throw new BadParamsError()
      }
    })
  // hash the new password
    .then(() => bcrypt.hash(req.body.password.new, bcryptSaltRounds))
    .then((hash) => {
      // set and save the new hashed password in the DB
      user.hashedPassword = hash
      return user.save()
    })
  // respond with no content and status 200
    .then(() => res.sendStatus(204))
  // pass any errors along to the error handler
    .catch(next)
})

// authenticate the user with requireToken
router.delete('/sign-out', requireToken, (req, res, next) => {
  // create a new random token for the user, invalidating the current one
  req.user.token = null
  // save the token and respond with 204
  req.user.save()
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
