var express = require('express')
var osprey = require('osprey')
var bodyParser = require('body-parser')
var join = require('path').join

var PORT = process.env.PORT || 3000
var router = osprey.Router()
var pokemonDb = {}

// Helpers

function wrapData (pok, id) {
  return {
    type: 'Pokemon',
    'id': id,
    attributes: pok
  }
}

function wrapDataObjs (poksObj) {
  var poks = []
  for (var id in poksObj) {
    poks.push(wrapData(poksObj[id], id))
  }
  return poks
}

function setCtHeader (req, res, next) {
  res.set('Content-Type', 'application/vnd.api+json')
  next()
}

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

router.route('/pokemon')
  .get(setCtHeader, (req, res) => {
    var data = {
      data: wrapDataObjs(pokemonDb)
    }
    res.json(data)
  })
  .post(setCtHeader, (req, res) => {
    var data = req.body.data
    pokemonDb[data.id] = data.attributes
    res.status(201).json({
      data: wrapData(data.attributes, data.id)
    })
  })

router.route('/pokemon/{id}', {id: {type: 'string'}})
  .get(item404, setCtHeader, (req, res) => {
    var pok = pokemonDb[req.params.id]
    res.json({
      data: wrapData(pok, req.params.id)
    })
  })
  .patch(item404, setCtHeader, (req, res) => {
    var pok = pokemonDb[req.params.id]
    var pokChanges = req.body.data.attributes
    for (var attr in pokChanges) {
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

osprey.loadFile(join(__dirname, 'api.raml'))
  .then((middleware) => {
    var app = express()
    app.use(bodyParser.json({
      type: 'application/vnd.api+json'
    }))
    app.use('/v1', middleware, router)
    app.listen(PORT, () => {
      console.log(`Application listening on ${PORT}...`)
    })
  })
