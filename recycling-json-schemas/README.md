---
publication: 'RAML API'
tags: ['API', 'Rest Api', 'Software Development', 'Software Engineering', 'RAML']
license: 'cc-40-by'
---

# Recycling your JSON schemas into RAML-powered APIs

One of my favorite things about RAML 1.0 is the new type system. I can now describe data-related parts such as headers, responses and requests in yaml-formated syntax, like the rest of my API specs. Great!

Now, what if I already have existing JSON schemas? I started spec'ing-out one of my new API's response as a JSON schema but I would like to switch to the new RAML data type. Do I need to re-write my schema?

Good news, there is an app for that! A command-line tool called [`ramldt2jsonschema`](https://github.com/raml-org/ramldt2jsonschema). I can use it to convert JSON schemas to RAML data types, and vice-versa.

I am going to use it to convert the JSON schema I wrote.
```json
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "description": "Human Schema",
  "type": "object",
  "definitions": {
    "address": {
      "type": "object",
      "properties": {
        "street_address": {"type": "string"},
        "city":           {"type": "string"},
        "state":          {"type": "string"},
        "country":        {"type": "string"},
        "planet":         {"type": "string"}
      },
      "required": ["street_address", "city", "country"]
    }
  },
  "properties": {
    "first_name": {
      "type": "string"
    },
    "last_name": {
      "type": "string"
    },
    "age": {
      "description": "Age in years",
      "type": "integer",
      "minimum": 0
    },
    "home_address": {"$ref": "#/definitions/address"},
    "work_address": {"$ref": "#/definitions/address"},
    "other_addresses": {
      "type": "array",
      "items": {"$ref": "#/definitions/address"}
    }
  },
  "required": ["first_name", "last_name", "home_address"]
}
```

Now let's convert it:
```raml
$ npm install -g ramldt2jsonschema
$ js2dt schema.json Human

#%RAML 1.0 Library

types:
  Address:
    type: object
    properties:
      street_address:
        type: string
        required: true
      city:
        type: string
        required: true
      state:
        type: string
        required: false
      country:
        type: string
        required: true
      planet:
        type: string
        required: false
  Human:
    description: Human Schema
    type: object
    properties:
      first_name:
        type: string
        required: true
      last_name:
        type: string
        required: true
      age:
        description: Age in years
        type: integer
        minimum: 0
        required: false
      home_address:
        required: true
        type: Address
      work_address:
        required: false
        type: Address
      other_addresses:
        type: array
        items:
          type: Address
        required: false
```

Well, that was easy!

Now that I have a RAML data type for that endpoint's response, let's try to wrap it inside a RAML file. I'm going to create a RAML file for my API: `api.raml`. To keep things organized, I am going to put my RAML type in a separate file: `library.raml`.
```sh
$ touch api.raml
$ js2dt schema.json Human > library.raml
```

Now, let's refer to my data type in `api.raml`.
```raml
#%RAML 1.0
title: Human API

uses:
  library: library.raml

/humans:
  post:
    body:
      application/json:
        type: library.Human
  get:
    responses:
      200:
        body:
          application/json:
            type: library.Human[]
            example:
                -
                  first_name: one
                  last_name: zero
                  home_address:
                    street_address: 1 Fine Street
                    city: Neartown
                    country: Farelly
                -
                  first_name: two
                  last_name: zero
                  home_address:
                    street_address: 10 Narrow Lane
                    city: Farcity
                    state: Wonderstate
                    country: United Islands

```

You'll notice that I've added an `example` property to my `get` method. That's because I don't want to wait until I've finished spec'ing-out my API to see what it looks like. So I am going to load my new RAML file into [Osprey Mock Service](https://github.com/mulesoft-labs/osprey-mock-service), which now supports RAML 1.0 (as well as [Osprey](https://github.com/mulesoft/osprey)).

```sh
$ npm install -g osprey-mock-service
$ osprey-mock-service -f api.raml -p 3000
Mock service running at http://localhost:3000
```

Let's try to see what it looks like (using [HTTPie](https://github.com/jkbrzt/httpie)).
```sh
$ http localhost:3000/humans
HTTP/1.1 200 OK
(...)

[
    {
        "first_name": "one",
        "home_address": {
            "city": "Neartown",
            "country": "Farelly",
            "street_address": "1 Fine Street"
        },
        "last_name": "zero"
    },
    {
        "first_name": "two",
        "home_address": {
            "city": "Farcity",
            "country": "United Islands",
            "state": "Wonderstate",
            "street_address": "10 Narrow Lane"
        },
        "last_name": "zero"
    }
]
```

Now, let's try to validate a POST request.
```sh
$ http POST localhost:3000/humans first_name=jon
HTTP/1.1 400 Bad Request
(...)
{
    "errors": [
        {
            "dataPath": "last_name",
            "keyword": "required",
            "message": "Missing required property: last_name",
            "schema": true,
            "type": "json"
        },
        {
            "dataPath": "home_address",
            "keyword": "required",
            "message": "Missing required property: home_address",
            "schema": true,
            "type": "json"
        }
    ],
    (...)
}
```

It works!

***

Within minutes, I was able to 1) convert my exisiting JSON schema to a RAML data type using [`ramldt2jsonschema`](https://github.com/raml-org/ramldt2jsonschema), 2) start spec'ing-out my API using that generated RAML type as a base and 3) get a peek at what my new API will look like using [Osprey Mock Service](https://github.com/mulesoft-labs/osprey-mock-service).
