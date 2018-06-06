const express = require('express')
const osprey = require('osprey')
const bodyParser = require('body-parser')
const join = require('path').join

const PORT = process.env.PORT || 3000
const router = osprey.Router()
const pokemonDb = {}

// Helpers

// Wraps pokemon data in JSON API response compatible object
function wrapData (pok, id) {
  return {
    type: 'Pokemon',
    'id': id,
    attributes: pok
  }
}

// Wraps multiple pokemon data in JSON API response compatible object
function wrapDataObjs (poksObj) {
  const poks = []
  for (let id in poksObj) {
    poks.push(wrapData(poksObj[id], id))
  }
  return poks
}

// Middleware to set proper Content-Type header
function setCtHeader (req, res, next) {
  res.set('Content-Type', 'application/vnd.api+json')
  next()
}

// Middleware that returns proper 404 if item is not found
function item404 (req, res, next) {
  if (pokemonDb[req.params.id] === undefined) {
    res.status(404).json({
      errors: [{
        status: '404',
        title: 'Resource not found',
        detail: `Pokemon with id ${req.params.id} not found`
      }]
    })
  }
  next()
}

// Requests processors

// Handles GET, POST requests to /pokemon
router.route('/pokemon')
  .get(setCtHeader, (req, res) => {
    const data = {
      data: wrapDataObjs(pokemonDb)
    }
    res.json(data)
  })
  .post(setCtHeader, (req, res) => {
    const data = req.body.data
    pokemonDb[data.id] = data.attributes
    res.set(
      'Location',
      `https://localhost:3000/v1/pokemon/${data.id}`)
    res.status(201).json({
      data: wrapData(data.attributes, data.id)
    })
  })

// Handles GET, PATCH, DELETE requests to /pokemon/{id}
router.route('/pokemon/{id}', {id: {type: 'string'}})
  .get(item404, setCtHeader, (req, res) => {
    const pok = pokemonDb[req.params.id]
    res.json({
      data: wrapData(pok, req.params.id)
    })
  })
  .patch(item404, setCtHeader, (req, res) => {
    const pok = pokemonDb[req.params.id]
    const pokChanges = req.body.data.attributes
    for (let attr in pokChanges) {
      pok[attr] = pokChanges[attr]
    }
    pokemonDb[req.params.id] = pok
    res.json({
      data: wrapData(pok, req.params.id)
    })
    res.status(204).end()
  })
  .delete(item404, setCtHeader, (req, res) => {
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
