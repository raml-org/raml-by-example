// Helpers

// Wraps pokemon data in JSON API response compatible object
function wrapData (pok, id) {
  return {
    type: 'Pokemon',
    'id': id,
    attributes: pok,
    links: {
      self: makePokemonURL(id)
    }
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

// Wraps response in JSON using raw Express funcs to avoid
// `charset=utf-8` media param being added to Content-Type header
function resJSON (res, obj) {
  res.send(Buffer.from(JSON.stringify(obj)))
}

// Return true if header contains parameter
function containsParams (header) {
  return header.indexOf(';') >= 0 && header.indexOf('=') >= 0
}

function makePokemonURL (id) {
  let url = 'http://localhost:3000/v1/pokemon'
  if (id !== undefined) {
    url += `/${id}`
  }
  return url
}

module.exports ={
  wrapData: wrapData,
  wrapDataObjs: wrapDataObjs,
  resJSON: resJSON,
  containsParams: containsParams,
  makePokemonURL: makePokemonURL
}
