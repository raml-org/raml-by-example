---
publication: 'RAML Playground'
tags: ['RAML', 'tutorial']
license: 'cc-40-by'
---

# Intro to oas-raml-converter

This is an introduction to [oas-raml-converter](https://github.com/mulesoft/oas-raml-converter). oas-raml-converter is a command line tool that helps to convert between different API specifications.

## Install

```sh
$ npm install oas-raml-converter
```

## Run

Download example RAML:

```sh
$ wget -O api.raml https://raw.githubusercontent.com/raml-org/raml-examples/master/typesystem/simple.raml
```

To convert RAML 1.0 to OAS 2.0 create a file called `index.js` with the following code:

```js
const converter = require('oas-raml-converter')
const raml10ToOas20 = new converter.Converter(
    converter.Formats.RAML, converter.Formats.OAS20)

raml10ToOas20.convertFile('./api.raml').then((oas) => {
  console.log(oas)
})
```

Run it with `node index.js` to see OAS 2.0 being logged:

<script src="https://gist.github.com/postatum/6a733511dba9dc7e6d9856fe3e01d44f"></script>
