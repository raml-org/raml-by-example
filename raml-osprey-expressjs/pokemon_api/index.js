var express = require('express')
var osprey = require('osprey')
var join = require('path').join

var PORT = process.env.PORT || 3000
var router = osprey.Router()
var db = {}

router.route('/pokemon')
  .get(function (req, res) {

  })
  .post(function (req, res) {

  })

router.route('/pokemon/{id}', {id: {type: 'string'}})
  .get(function (req, res) {
    console.log(req.params.id)
  })
  .patch(function (req, res) {

  })
  .delete(function (req, res) {

  })

osprey.loadFile(join(__dirname, 'api.raml'))
  .then(function (middleware) {
    var app = express()
    app.use('/v1', middleware, router)
    app.listen(PORT, function () {
      console.log('Application listening on ' + PORT + '...')
    })
  })
