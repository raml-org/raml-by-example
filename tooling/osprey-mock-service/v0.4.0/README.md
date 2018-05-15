---
publication: 'RAML Playground'
tags: ['nodejs', 'WebAPI', 'Mocking', 'JavaScript', 'RAML']
license: 'cc-40-by'
---

# `osprey-mock-service` v0.4.0 released 🚀

`osprey-mock-service` [v0.4.0](https://github.com/mulesoft-labs/osprey-mock-service/releases/tag/v0.4.0) introduces a single improvment, but it is more significant than it seems.

## Preamble

RAML encourages the use of examples to illustrate payloads throughout the API Specification. There are two ways to go about examples in RAML: 
- object-level examples
- property-level examples

`osprey-mock-service` uses those RAML examples to mock API responses. This is in order to give a way for API designers and developers to get a sense of what an API will look like prior to implementing it.

### Object-level examples

This is how an example in a GET response object can be defined:
```raml
#%RAML 1.0
title: People API
baseUri: http://127.0.0.1
mediaType: [ application/json ]

/people:
  get:
    responses:
      200:
        body:
          properties:
            first_name: string
            last_name: string
            age: number
          example:
            first_name: Jane
            last_name: Dow
            age: 85

```

and running this RAML file using `osprey-mock-service` CLI:
```sh
$ osprey-mock-service -f api.raml -p 1234
```

will end-up returning a response like this one this:
```sh
$ http http://localhost:1234/people
HTTP/1.1 200 OK
(...)

{
  "first_name": "Jane",
  "last_name": "Dow",
  "age": 85
}
```

Now, here's an example of defining multiple RAML named examples:
```raml
(...)

/people:
  get:
    responses:
      200:
        body:
          properties:
            first_name: string
            last_name: string
            age: number
          examples:
            Jane:
              first_name: Jane
              last_name: Dow
              age: 85
            John:
              first_name: John
              last_name: Doe
              age: 22
```

In this case, `osprey-mock-service` will "randomly" return either:
```sh
$ http http://localhost:1234/people
HTTP/1.1 200 OK
(...)

{
  "first_name": "Jane",
  "last_name": "Dow",
  "age": 85
}
```

or:
```sh
$ http http://localhost:1234/people
HTTP/1.1 200 OK
(...)

{
  "first_name": "John",
  "last_name": "Doe",
  "age": 22
}
```

## Introducing property-level examples

Prior to [v0.4.0](https://github.com/mulesoft-labs/osprey-mock-service/releases/tag/v0.4.0), `osprey-mock-service` was not returning any property-level examples, such as the ones defined below.

```raml
#%RAML 1.0
title: People API
baseUri: http://127.0.0.1
mediaType: [ application/json ]

/people:
  get:
    responses:
      200:
        body:
          properties:
            first_name:
              type: string
              example: Jane
            last_name:
              type: string
              example: Doe
            age:
              type: number
              example: 10
```

However, it now handles property-level examples properly, and will compile property examples into one single response object:
```sh
$ http http://localhost:1234/people
HTTP/1.1 200 OK
(...)

{
  "first_name": "Jane",
  "last_name": "Doe",
  "age": 10
}
```

🚀🚀🚀
