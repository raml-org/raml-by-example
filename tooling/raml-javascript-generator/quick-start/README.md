---
publication: 'RAML Playground'
tags: ['RAML', 'tutorial']
license: 'cc-40-by'
---

# Intro to raml-javascript-generator

This is an introduction to [raml-javascript-generator](https://github.com/mulesoft-labs/raml-javascript-generator). raml-javascript-generator is a tool that can generate JavaScript API client from RAML.

## Install


```sh
$ npm install raml-javascript-generator -g
```

## Run

Download example RAML:

```sh
$ wget -O api.raml https://raw.githubusercontent.com/raml-org/raml-examples/master/helloworld/helloworld.raml
```

Generate JavaScript client:

```sh
$ raml-javascript-generator api.raml -o js-client
```

You should now have js client with documentation generated inside `./js-client` folder.

Now you can install it with:

```sh
$ cd js-client
$ npm install hello-world
```

And use it in your JavaScript code:

```js
const HelloWorld = require('hello-world')
const client = new HelloWorld({ ... })

client('GET', '/helloworld', {baseUri: 'http://example.com'})

# or
client.helloworld.get([query, [options]]).then(...)
```