---
publication: 'RAML Playground'
tags: ['RAML', 'Quick Start', 'Swagger', 'OAS']
license: 'cc-40-by'
---

# `oas-raml-converter` Quick Start

This is an introduction to [oas-raml-converter](https://github.com/mulesoft/oas-raml-converter). `oas-raml-converter` is a command line tool that helps convert to and from RAML and OAS.

Let's begin by installing `oas-raml-converter` as a command-line tool:
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
```

the output will look like this:

<script src="https://gist.github.com/66dc95529d6c98291d8174d239d72ef3"></script>

and we can even convert that same API Spec from RAML 1.0 to OAS 3.0 with:
```sh
$ oas-raml-converter --from RAML --to OAS30 ./api.raml > api.oas3
```

## Using `oas-raml-converter` as a NodeJS library
`oas-raml-converter` can also be used as a library! This is particularly useful when processing either the input or the output. Let's see how it works. 

In this scenario, I'll use `oas-raml-converter` to convert from RAML 1.0 to OAS 2.0, and then, use `yamljs` to convert the output to the YAML syntax.

I'll start by initializing my project and installing both libraries:
```sh
$ npm init --yes
(...)

$ npm install --save oas-raml-converter yamljs
(...)
```

then, let's create an `index.js` file with the following code:

<script src="https://gist.github.com/1c7a6b15d7888912f2de359bd4cdc3ea"></script>

and then run with `node .` which will output my API Spec in OAS 2.0 format with the YAML syntax:

<script src="https://gist.github.com/7e131b2c1b00e1cf50ec38f8c82feba4"></script>
