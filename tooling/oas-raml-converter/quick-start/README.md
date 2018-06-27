---
publication: 'RAML Playground'
tags: ['RAML', 'tutorial']
license: 'cc-40-by'
---

# Intro to oas-raml-converter

This is an introduction to [oas-raml-converter](https://github.com/mulesoft/oas-raml-converter). `oas-raml-converter` is a command line tool that helps to convert between different API specifications.

Let's begin by installing the library:
```sh
$ npm i -g oas-raml-converter
```

and let's also grab a RAML file:
```sh
$ curl https://raw.githubusercontent.com/raml-org/raml-examples/master/typesystem/simple.raml -o api.raml
```

Now, we can convert it from RAML 1.0 to OAS 2.0 with the following command:
```sh
$ oas-raml-converter --from RAML --to OAS20 ./api.raml > api.oas2
(...)
```

and we can even convert that same API Spec from RAML 1.0 to OAS 3.0:
```sh
$ oas-raml-converter --from RAML --to OAS20 ./api.raml > api.oas2
(...)
```

## Using oas-raml-converter as a NodeJS library
`oas-raml-converter` can also be used as a library! This is particularly useful when processing either the input beforehand or the output afterhand. Let's see how it works.

Let's create a file called `index.js` with the following code:
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
