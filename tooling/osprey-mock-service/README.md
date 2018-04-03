Perhaps the quickest way to turn a RAML file into a local mock service is to use [osprey-mock-service](https://github.com/mulesoft-labs/osprey-mock-service). It's simple to get started.

## Hello world
First we'll create a small hello world api, and save it as `api.raml`

```yaml
#%RAML 1.0
title: Example API
baseUri: http://127.0.0.1

/:
  get:
    responses:
      200:
        body:
          application/json:
            example:
              hello: world
```

## Install Dependencies

We're going to use the service with express.js, so let's install both from npm.

```
npm install --save express osprey-mock-service
```

## Write the app
 In only 10 lines of code we can create a small express app, and register our mock service as middleware.

```js
var mockService = require('osprey-mock-service')
var express = require('express')
var path = require('path')

var app

mockService.loadFile(path.join(__dirname, 'api.raml'), {})
  .then(function (mockApp) {
    app = express()
    app.use(mockApp)
    app.listen(3000)
  })
```

## Test It
We can use `curl` or any http client to make sure it's working.

```
curl 127.0.0.1:3000
```

## Flesh it out
Here we'll add a more complex endpoint that expects an authorization header.

```
/users:
  get:
    headers:
      Authorized:
        type: string
        enum: [yes]
    responses:
      200:
        body:
          application/json:
            example:
              firstname: john
              lastname: doe
```

Use the `-H` flag to pass a header in curl.

```
curl 127.0.0.1:3000/users -H authorized:true
```

## Limitations

osprey-mock-services works well out of the box, but it does have limitations. This module only uses the `example` (or `examples`) property inside a given resource/method body. It does not take into consideration any of the `example` properties defined inside the `properties` or `schema` of the body itself.

