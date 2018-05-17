const r2j = require('ramldt2jsonschema')
const fs = require('fs')
const yaml = require('yaml')

const jsonData = fs.readFileSync('./calendar.json').toString()

const raml = r2j.js2dt(jsonData, 'Calendar')

// you can decide if you want a RAML Library
const library = '#%RAML 1.0 Library\n' + yaml.safeDump({ types: raml }, {'noRefs': true})
fs.writeFileSync('calendar_library.raml', library)

// or a Datatype (this only works properly if there were no extra definitions in the JSON schema)
const datatype = '#%RAML 1.0 DataType\n' + yaml.safeDump(raml['Calendar'], {'noRefs': true})
fs.writeFileSync('calendar_datatype.raml', datatype)
