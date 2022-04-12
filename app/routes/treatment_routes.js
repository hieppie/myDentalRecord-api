// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for examples
const Treatment = require('../models/treatment')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// CREATE
// POST /treatments
router.post('/treatments', requireToken, (req, res, next) => {
  // set owner of new treatment to be current user
  // get treatment data from the request
  const treatment = req.body.treatment
  // attach the owner using 'req.user.id
  treatment.owner = req.user.id
  // req.body.treatment.owner = req.user.id

  Treatment.create(treatment)
    // respond to successful `create` with status 201 and JSON of new "example"
    .then(treatment => {
      res.status(201).json({ treatment: treatment.toObject() })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// INDEX
// GET /treatments
router.get('/treatments', requireToken, (req, res, next) => {
  Treatment.find({ owner: req.user.id })
    .then(treatments => {
      // `treatments` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return treatments.map(treatment => treatment.toObject())
    })
    // respond with status 200 and JSON of the treatments
    .then(treatments => res.status(200).json({ allTreatments: treatments }))
    // if an error occurs, pass it to the handler middleware
    .catch(next)
})

// SHOW
// GET /treatments/5a7db6c74d55bc51bdf39793
router.get('/treatments/:id', requireToken, (req, res, next) => {
  // get id of treatment from params
  const id = req.params.id
  // req.params.id will be set based on the `:id` in the route
  Treatment.findById(id)
    .then(handle404)
    // if `findById` is successful, respond with 200 and "example" JSON
    .then(treatment => res.status(200).json({ treatment: treatment.toObject() }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// UPDATE
// PATCH /treatments/5a7db6c74d55bc51bdf39793
router.patch('/treatments/:id', requireToken, removeBlanks, (req, res, next) => {
  // if the client attempts to change the `owner` property by including a new
  // owner, prevent that by deleting that key/value pair
  delete req.body.treatment.owner
  // get id of event from params
  const id = req.params.id
  // get event data from request
  const treatmentData = req.body.treatment

  Treatment.findById(id)
  // handle 404 error if no event found
    .then(handle404)
    .then(treatment =>
      // pass the `req` object and the Mongoose record to `requireOwnership`
      // it will throw an error if the current user isn't the owner
      requireOwnership(req, treatment))
    .then(treatment => {
      // pass the result of Mongoose's `.update` to the next `.then`
      Object.assign(treatment, treatmentData)
      // save treatment to mongodb
      return treatment.save()
    })

    // if that succeeded, return 204 and no JSON
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/treatments/:id', requireToken, (req, res, next) => {
  const id = req.params.id
  Treatment.findById(id)
    .then(handle404)
    .then(treatment => {
      // throw an error if current user doesn't own `example`
      requireOwnership(req, treatment)
      // delete the example ONLY IF the above didn't throw
      treatment.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
