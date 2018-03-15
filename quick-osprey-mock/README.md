Create a hello world api `api.raml`.

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

Install express and osprey-mock-service

```
npm install --save express osprey-mock-service
```

Create a small node app.

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

Try it out.

```
curl 127.0.0.1:3000
```

Add a more complex endpoint.

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

Try it out.

```
curl 127.0.0.1:3000/users -H authorized:true
```
