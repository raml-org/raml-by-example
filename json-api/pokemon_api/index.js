const express = require('express')
const osprey = require('osprey')
const bodyParser = require('body-parser')
const join = require('path').join
const helpers = require('./helpers')
const mware = require('./middleware')

const PORT = process.env.PORT || 3000
const router = osprey.Router()
const pokemonDb = {}


// Apply middleware
router.use(mware.setResponseCtHeader)
router.use(mware.rejectCtWithParams)
router.use(mware.rejectAcceptWithParams)
router.use('/pokemon/{id}', (req, res, next) => {
  mware.item404(pokemonDb, req, res, next)
})


// Request handlers

// Handles GET, POST requests to /pokemon
router.route('/pokemon')
  .get((req, res) => {
    const data = {
      data: helpers.wrapDataObjs(pokemonDb)
    }
    helpers.resJSON(res, data)
  })
  .post((req, res) => {
    const data = req.body.data
    pokemonDb[data.id] = data.attributes
    res.set(
      'Location',
      `http://localhost:3000/v1/pokemon/${data.id}`)
    res.status(201)
    helpers.resJSON(res, {
      data: helpers.wrapData(data.attributes, data.id)
    })
  })

// Handles GET, PATCH, DELETE requests to /pokemon/{id}
router.route('/pokemon/{id}', {id: {type: 'string'}})
  .get((req, res) => {
    const pok = pokemonDb[req.params.id]
    helpers.resJSON(res, {
      data: helpers.wrapData(pok, req.params.id)
    })
  })
  .patch((req, res) => {
    const pok = pokemonDb[req.params.id]
    const pokChanges = req.body.data.attributes
    for (let attr in pokChanges) {
      pok[attr] = pokChanges[attr]
    }
    pokemonDb[req.params.id] = pok
    helpers.resJSON(res, {
      data: helpers.wrapData(pok, req.params.id)
    })
    res.status(204).end()
  })
  .delete((req, res) => {
    delete pokemonDb[req.params.id]
    res.status(204).end()
  })

// Loads RAML file, sets up request body parsing, starts server
osprey.loadFile(join(__dirname, 'api.raml'))
  .then((middleware) => {
    const app = express()
    app.use(bodyParser.json({
      type: 'application/vnd.api+json'
    }))
    app.use('/v1', middleware, router)
    app.listen(PORT, () => {
      console.log(`Application listening on ${PORT}...`)
    })
  })
