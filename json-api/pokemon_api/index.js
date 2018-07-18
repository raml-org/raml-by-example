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
router.use(mware.rejectRequestParam('include'))
router.use('/pokemon/{id}', (req, res, next) => {
  mware.item404(pokemonDb, req, res, next)
})
router.use('/pokemon', (req, res, next) => {
  mware.rejectDuplicateCreation(pokemonDb, req, res, next)
})
router.use('/pokemon', mware.rejectNotSupportedType('Pokemon'))


// Request handlers

// Handles GET, POST requests to /pokemon
router.route('/pokemon')
  .get((req, res) => {
    const data = {
      data: helpers.wrapDataObjs(
        pokemonDb, helpers.getSparseFields(req),
        helpers.getSortFields(req)),
      links: {self: helpers.makePokemonURL()}
    }
    helpers.resJSON(res, data)
  })
  .post((req, res) => {
    const data = req.body.data
    pokemonDb[data.id] = data.attributes
    res.set('Location', helpers.makePokemonURL(data.id))
    res.status(201)
    helpers.resJSON(res, {
      data: helpers.wrapData(
        data.attributes, data.id, helpers.getSparseFields(req))
    })
  })

// Handles GET, DELETE requests to /pokemon/{id}
router.route('/pokemon/{id}', {id: {type: 'string'}})
  .get((req, res) => {
    const pok = pokemonDb[req.params.id]
    helpers.resJSON(res, {
      data: helpers.wrapData(
        pok, req.params.id, helpers.getSparseFields(req))
    })
  })
  .delete((req, res) => {
    delete pokemonDb[req.params.id]
    res.status(204).end()
  })

// Loads RAML file, sets up request body parsing, starts server
osprey.loadFile(join(__dirname, 'api.raml'), {errorHandler: mware.errorResponder})
  .then((middleware) => {
    const app = express()
    app.use(bodyParser.json({
      type: 'application/vnd.api+json'
    }))
    app.use('/v1', middleware, router)
    app.use(mware.wrapErrors)
    app.listen(PORT, () => {
      console.log(`Application listening on ${PORT}...`)
    })
  })
