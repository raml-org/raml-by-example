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

// Wraps Express errors in JSON API format
function wrapErrors (err, req, res, next) {
  setResponseCtHeader(req, res, () => {})
  const status = err.status ? err.status : 500
  res.status(status)
  helpers.resJSON(res, {
    errors: [{
      status: status.toString(),
      code: err.name,
      detail: err.message
    }]
  })
}

// Wraps Osprey validation errors in JSON API format
function errorResponder (req, res, errors, stack) {
  setResponseCtHeader(req, res, () => {})
  let outErrs = []
  errors.forEach((err) => {
    outErrs.push({
      id: err.id,
      source: {
        pointer: err.dataPath
      },
      detail: err.detail,
      meta: err.meta,
      title: err.message,
      code: err.type + '/' + err.keyword + '/' + err.schema,
    })
  })
  helpers.resJSON(res, {errors: outErrs})
}

module.exports = {
  setResponseCtHeader: setResponseCtHeader,
  item404: item404,
  rejectCtWithParams: rejectCtWithParams,
  wrapErrors: wrapErrors,
  errorResponder: errorResponder
}
