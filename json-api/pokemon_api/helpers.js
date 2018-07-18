const sortBy = require('sort-by')

// Helpers

// Wraps pokemon data in JSON API response compatible object
function wrapData (pok, id, fields) {
  return {
    type: 'Pokemon',
    'id': id,
    attributes: makeSparse(pok, fields),
    links: {
      self: makePokemonURL(id)
    }
  }
}

// Make object sparse by only including particular fields
function makeSparse (obj, fields) {
  if (fields.length == 0) {
    return obj
  }
  let newObj = {}
  fields.forEach((field) => {
    newObj[field] = obj[field]
  })
  return newObj
}

// Wraps multiple pokemon data in JSON API response compatible object
function wrapDataObjs (poksObj, fields, sortFields) {
  let poks = []
  for (let id in poksObj) {
    poks.push(wrapData(poksObj[id], id, fields))
  }
  poks = sortObjects(poks, sortFields)
  return poks
}

// Sort objects by particular fields
function sortObjects (objs, sortFields) {
  if (sortFields.length === 0) {
    return objs
  }
  sortFields = sortFields.map((field) => {
    let desc = false
    if (field[0] === '-') {
      desc = true
      field = field.slice(1)
    }
    let newField = `attributes.${field}`
    return desc ? '-' + newField : newField
  })
  objs = objs.sort(sortBy(...sortFields))
  return objs
}

// Wraps response in JSON using raw Express funcs to avoid
// `charset=utf-8` media param being added to Content-Type header
function resJSON (res, obj) {
  res.send(Buffer.from(JSON.stringify(obj)))
}

// Return true if header contains parameter
function containsParams (header) {
  return header.indexOf(';') >= 0 && header.indexOf('=') >= 0
}

// Compose Pokemon endpoint URL
function makePokemonURL (id) {
  let url = 'http://localhost:3000/v1/pokemon'
  if (id !== undefined) {
    url += `/${id}`
  }
  return url
}

// Get split value of request param
function getParamVal (req, param) {
  let fields = req.query[param] || ''
  fields = fields.split(',')
  return fields.filter((field) => {
    if (field !== '') {
      return field.trim().toLowerCase()
    }
  })
}

// Get split value of sparse request param
function getSparseFields (req) {
  return getParamVal(req, 'fields[pokemon]')
}

// Get split value of sorting request param
function getSortFields (req) {
  return getParamVal(req, 'sort')
}

module.exports ={
  wrapData: wrapData,
  wrapDataObjs: wrapDataObjs,
  resJSON: resJSON,
  containsParams: containsParams,
  makePokemonURL: makePokemonURL,
  getSparseFields: getSparseFields,
  getSortFields: getSortFields
}
