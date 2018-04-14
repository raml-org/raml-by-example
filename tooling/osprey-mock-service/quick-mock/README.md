---
publication: 'RAML Playground'
tags: ['expressjs', 'osprey', 'RAML', 'API', 'Mocking']
license: 'cc-40-by'
---

# Quick mocks with osprey-mock-service

Perhaps the quickest way to turn a RAML file into a local mock service is to use [osprey-mock-service](https://github.com/mulesoft-labs/osprey-mock-service). It's simple to get started.

## Hello world
First we'll create a small hello world api, and save it as `api.raml`

```raml
#%RAML 1.0
title: Example API
baseUri: http://127.0.0.1
mediaType: application/json

/:
  get:
    responses:
      200:
        body:
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

<script src="https://gist.github.com/89edc2d2441980bb7468ca1f28f2a253"></script>

## Run it

```
node .
```

## Test it

We can use `curl` or any http client to make sure it's working.

```
curl 127.0.0.1:3000

{
  "hello": "world"
}
```

## Flesh it out
Here we'll add a more complex endpoint that expects an authorization header.

<script src="https://gist.github.com/7f1dfd78de2ac47bb7676f5b59785116"></script>

Use the `-H` flag to pass a header in curl.

```
$ curl 127.0.0.1:3000/users -H authorized:no

{
  "errors": [
    {
      "type": "header",
      "dataPath": "authorized",
      "keyword": "enum",
      "schema": [
        "yes"
      ],
      "data": "no",
      "message": "No enum match for: yes"
    }
  ],
  "stack": "(...)"
}
```

## Limitations
`osprey-mock-service` works well out of the box, but it does have limitations. This module only uses the `example` (or `examples`) property inside a given resource/method body. It does not take into consideration any of the `example` properties defined inside the `properties` or `schema` of the body itself.
