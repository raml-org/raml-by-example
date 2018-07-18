---
publication: 'RAML Playground'
tags: ['RAML', 'ramldt2jsonschema', 'JSON Schema']
license: 'cc-40-by'
---

# Designing a {JSON:API} API with RAML (Part 2/2)

In [Part 1](), we covered how to design an API that follows the JSON API conventions. In this part, part 2, we'll get a preview of what that API would look like once implemented.


## Interacting with the server

### Starting the server

```sh
$ cd pokemon_api
$ npm install .
$ node .
```

### 200 OK

One rule of JSON API is:
> JSON API requires use of the JSON API media type (application/vnd.api+json) for exchanging data.

This means that we must pass the header `Content-Type: application/vnd.api+json` in every requests.

```sh
$ http GET localhost:3000/v1/pokemon Content-Type:application/vnd.api+json

HTTP/1.1 200 OK
(...)
{
    "data": [],
    "links": {
        "self": "http://localhost:3000/v1/pokemon"
    }
}
```

### 201 Created

The newly created object is returned, in JSON API format, and a `Location` response header is included as per the spec:

> The response SHOULD include a Location header identifying the location of the newly created resource.

```sh
$ http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"8618284c-89a1-11e8-9a94-a6cf71072f73","attributes":{"name":"Bulbasaur","generation":1,"types":["Grass","Poison"],"species":"Seed Pokemon","abilities":["Overgrow","Chlorophyll"],"weightKg":7}}'

HTTP/1.1 201 Created
(...)
Location: http://localhost:3000/v1/pokemon/8618284c-89a1-11e8-9a94-a6cf71072f73

{
    "data": {
        "attributes": {
            "abilities": [
                "Overgrow",
                "Chlorophyll"
            ],
            "generation": 1,
            "name": "Bulbasaur",
            "species": "Seed Pokemon",
            "types": [
                "Grass",
                "Poison"
            ],
            "weightKg": 7
        },
        "id": "8618284c-89a1-11e8-9a94-a6cf71072f73",
        "links": {
            "self": "http://localhost:3000/v1/pokemon/8618284c-89a1-11e8-9a94-a6cf71072f73"
        },
        "type": "Pokemon"
    }
}

```

Let's create a few more objects:

```sh
$ http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"86182ad6-89a1-11e8-9a94-a6cf71072f73","attributes":{"name":"Emolga","generation":5,"types":["Electric","Flying"],"species":"Sky Squirrel Pokemon","abilities":["Static","Motor Drive"],"weightKg":5}}'
(...)

$ http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"86182c5c-89a1-11e8-9a94-a6cf71072f73","attributes":{"name":"Minun","generation":3,"types":["Electric"],"species":"Cheering Pokemon","abilities":["Minus","Vold Absorb"],"weightKg":4}}'
(...)
```

### GETing single objects

```sh
$ http GET localhost:3000/v1/pokemon/8618284c-89a1-11e8-9a94-a6cf71072f73 Content-Type:application/vnd.api+json

HTTP/1.1 200 OK
(...)
{
    "data": {
        "attributes": {
            "abilities": [
                "Overgrow",
                "Chlorophyll"
            ],
            "generation": 1,
            "name": "Bulbasaur",
            "species": "Seed Pokemon",
            "types": [
                "Grass",
                "Poison"
            ],
            "weightKg": 7
        },
        "id": "8618284c-89a1-11e8-9a94-a6cf71072f73",
        "links": {
            "self": "http://localhost:3000/v1/pokemon/8618284c-89a1-11e8-9a94-a6cf71072f73"
        },
        "type": "Pokemon"
    }
}
```

### DELETEing objects

```sh
$ http DELETE localhost:3000/v1/pokemon/86182ad6-89a1-11e8-9a94-a6cf71072f73 Content-Type:application/vnd.api+json
(...)
```

### Error objects

> Error objects provide additional information about problems encountered while performing an operation. Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document.

```sh
$ http GET localhost:3000/v1/pokemon/86182ad6-89a1-11e8-9a94-a6cf71072f73 Content-Type:application/vnd.api+json

HTTP/1.1 404 Not Found
(...)
{
    "errors": [
        {
            "detail": "Pokemon with id 86182ad6-89a1-11e8-9a94-a6cf71072f73 not found",
            "status": "404",
            "title": "Resource not found"
        }
    ]
}
```