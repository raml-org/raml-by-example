var r2j = require('ramldt2jsonschema')
var fs = require('fs')

var jsonData = fs.readFileSync('./calendar.json').toString()

r2j.js2dt(jsonData, 'Calendar', function (err, raml) {
  var library = '#%RAML 1.0 Library\n' + raml
  fs.writeFileSync('calendar_library.raml', library)
})
