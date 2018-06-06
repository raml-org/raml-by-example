---
publication: 'RAML Playground'
tags: ['RAML', 'Quick Start', 'JSON Schema']
license: 'cc-40-by'
---

# `ramldt2jsonschema` Quick Start (JSON Schema > RAML)

Download a JSON Schema, we'll use an example from [json-schema.org](http://json-schema.org):
```sh
$ curl http://json-schema.org/example/calendar.json >calendar.json
```

Download `ramldt2jsonschema` and `js-yaml` for manipulating YAML:
```sh
$ npm install --save ramldt2jsonschema js-yaml
```

Write a small node app that outputs two RAML files out of that JSON Schema:
```javascript
# File: index.js
const r2j = require('ramldt2jsonschema')
const fs = require('fs')
const yaml = require('js-yaml')

const jsonData = fs.readFileSync('./calendar.json').toString()

const raml = r2j.js2dt(jsonData, 'Calendar')

// you can decide if you want a RAML Library
const library = '#%RAML 1.0 Library\n' + yaml.safeDump({ types: raml }, {'noRefs': true})
fs.writeFileSync('calendar_library.raml', library)

// or a Datatype (this only works properly if there were no extra definitions in the JSON schema)
const datatype = '#%RAML 1.0 DataType\n' + yaml.safeDump(raml['Calendar'], {'noRefs': true})
fs.writeFileSync('calendar_datatype.raml', datatype)
```
