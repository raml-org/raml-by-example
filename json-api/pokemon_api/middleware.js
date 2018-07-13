const helpers = require('./helpers')

// Middleware

// Middleware to set proper Content-Type header
function setResponseCtHeader (req, res, next) {
  res.set('Content-Type', 'application/vnd.api+json')
  next()
}

// Middleware that returns proper 404 if item is not found
function item404 (pokemonDb, req, res, next) {
  if (pokemonDb[req.params.id] === undefined) {
    res.status(404)
    helpers.resJSON(res, {
      errors: [{
        status: '404',
        title: 'Resource not found',
        detail: `Pokemon with id ${req.params.id} not found`
      }]
    })
    return
  }
  next()
}

// Reject requests with media type params
function rejectCtMediaTypeParams (req, res, next) {
  const ct = req.headers['content-type']
  if (ct.indexOf('application/vnd.api+json') >= 0) {
    let params = ct.split(';')[1] || ''
    params = params.replace(' ', '')
    if (params.length > 0) {
      res.status(415)
      helpers.resJSON(res, {
        errors: [{
          status: '415',
          title: 'Unsupported Media Type',
          detail: 'Media type parameters are not allowed in Content-Type header'
        }]
      })
      return
    }
  }
  next()
}

module.exports = {
  setResponseCtHeader: setResponseCtHeader,
  item404: item404,
  rejectCtMediaTypeParams: rejectCtMediaTypeParams
}
