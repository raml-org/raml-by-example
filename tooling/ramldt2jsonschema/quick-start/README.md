---
publication: 'RAML Playground'
tags: ['RAML', 'Quick Start', 'JSON Schema', 'tutorial']
license: 'cc-40-by'
---

# `ramldt2jsonschema` Quick Start (js2dt)

Grab a JSON Schema, we'll use one from [json-schema.org](http://json-schema.org):
```sh
$ curl http://json-schema.org/example/calendar.json >calendar.json
```

Download `ramldt2jsonschema` and `js-yaml` for manipulating YAML:
```sh
$ npm install --save ramldt2jsonschema js-yaml
```

Now let's write a small node app that outputs two RAML files out of that JSON Schema:

<script src="https://gist.github.com/6407f4f4e257742e733d79529e1288b0"></script>

and using the CLI can produce a similar output:
```sh
$ npm install -g ramldt2jsonschema
(...)
$ js2dt calendar.json >calendar_datatype.raml

```
