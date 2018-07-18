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
function wrapDataObjs (poksObj, fields) {
  const poks = []
  for (let id in poksObj) {
    poks.push(wrapData(poksObj[id], id, fields))
  }
  return poks
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

// Get split value of sparse request param
function getSparseFields (req) {
  let fields = req.query['fields[pokemon]'] || ''
  fields = fields.split(',')
  return fields.filter((field) => {
    if (field !== '') {
      return field.trim().toLowerCase()
    }
  })
}

module.exports ={
  wrapData: wrapData,
  wrapDataObjs: wrapDataObjs,
  resJSON: resJSON,
  containsParams: containsParams,
  makePokemonURL: makePokemonURL,
  getSparseFields: getSparseFields
}
