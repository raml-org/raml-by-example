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

// Reject requests with media type params in 'Content-Type'
function rejectCtWithParams (req, res, next) {
  const hdr = req.headers['content-type']
  if (hdr.indexOf('application/vnd.api+json') >= 0) {
    if (helpers.containsParams(hdr)) {
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

// Reject requests with media type params in 'Accept'
function rejectAcceptWithParams (req, res, next) {
  let valid
  const accepts = req.headers.accept.split(',')
  for (let hdr of accepts) {
    if (hdr.indexOf('application/vnd.api+json') >= 0) {
      if (!helpers.containsParams(hdr)) {
        valid = true
        break
      }
      valid = false
    }
  }

  if (valid || valid === undefined) {
    next()
  } else {
    res.status(406)
    helpers.resJSON(res, {
      errors: [{
        status: '406',
        title: 'Not Acceptable',
        detail: '"Accept" header contains the JSON API media type and all ' +
                'instances of that media type are modified with media ' +
                'type parameters'
      }]
    })
  }
}

module.exports = {
  setResponseCtHeader: setResponseCtHeader,
  item404: item404,
  rejectCtWithParams: rejectCtWithParams,
  rejectAcceptWithParams: rejectAcceptWithParams
}
