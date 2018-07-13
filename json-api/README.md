---
publication: 'RAML Playground'
tags: ['RAML', 'ramldt2jsonschema', 'JSON Schema']
license: 'cc-40-by'
---

# Designing a {JSON:API} API with RAML

JSON API is a specification that describes a set of conventions for building APIs in JSON. The [JSON API specs](http://jsonapi.org/format/) introduces it as follow:

> JSON API is a specification for how a client should request that resources be fetched or modified, and how a server should respond to those requests.
>
> JSON API is designed to minimize both the number of requests and the amount of data transmitted between clients and servers. This efficiency is achieved without compromising readability, flexibility, or discoverability.

Furthermore, the [front page](http://jsonapi.org) helps put things into perspective:

> If you’ve ever argued with your team about the way your JSON responses should be formatted, JSON API can be your anti-bikeshedding tool.
>
> By following shared conventions, you can increase productivity, take advantage of generalized tooling, and focus on what matters: your application.


## Sample project

We're going to design an API in RAML that follows the JSON API conventions. We will design this API in such a way that all its JSON API -specific patterns will be placed inside reusable RAML fragments. Those fragments may be reused later-on to design more JSON APIs.

After designing this API, we'll be implementing it with NodeJS, Express web framework and [Osprey](https://github.com/mulesoft/osprey) for payload validation.


## Project elements

*pokemon_api/package.json* - Package file with dependencies.
*pokemon_api/api.raml* - JSON API spec that defines few routes, types and uses libraries. Available endpoints: `GET /pokemon, POST /pokemon, GET /pokemon/{id}, PATCH /pokemon/{id}, DELETE /pokemon/{id}`.
*pokemon_api/index.js* - Osprey/Express app. Defines helper funcs/middleware; request handlers; etc. Responses have proper content-type, status codes, location header on POST; data is wrapped the way JSON API requires it;
*pokemon_api/examples/* - Contains collection and item responses examples. These are used in a **Interacting with the server** section.
*pokemon_api/libraries/jsonApiLibrary.raml* - Defines RAML Data Types required to satisfy JSON API requirements.
*pokemon_api/libraries/jsonApiCollections.raml* - Defines resourceTypes and traits required to properly describe the JSON API RAML spec.


* Payload validation is done with [Osprey](https://github.com/mulesoft/osprey);
* Responses, requests, and error messages are formatted according to JSON API 1.0;
* Created objects are stored in-memory, restarting the server will erase all data;

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
    "data": []
}
```

### 201 Created

The newly created object is returned, in JSON API format, and a `Location` response header is included as per the spec:

> The response SHOULD include a Location header identifying the location of the newly created resource.

```sh
$ http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"1","attributes":{"name":"Bulbasaur","generation":1,"types":["Grass","Poison"],"species":"Seed Pokemon","abilities":["Overgrow","Chlorophyll"],"weightKg":7}}'

HTTP/1.1 201 Created
(...)
Location: http://localhost:3000/v1/pokemon/1

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
        "id": "1",
        "type": "Pokemon"
    }
}

```

Let's create a few more objects:

```sh
$ http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"2","attributes":{"name":"Emolga","generation":5,"types":["Electric","Flying"],"species":"Sky Squirrel Pokemon","abilities":["Static","Motor Drive"],"weightKg":5}}'
(...)

$ http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"3","attributes":{"name":"Minun","generation":3,"types":["Electric"],"species":"Cheering Pokemon","abilities":["Minus","Vold Absorb"],"weightKg":4}}'
(...)
```

### GETing single objects

```sh
$ http GET localhost:3000/v1/pokemon/1 Content-Type:application/vnd.api+json

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
        "id": "1",
        "type": "Pokemon"
    }
}
```

### DELETEing objects

```sh
$ http DELETE localhost:3000/v1/pokemon/2 Content-Type:application/vnd.api+json
(...)
```

### Error objects

> Error objects provide additional information about problems encountered while performing an operation. Error objects MUST be returned as an array keyed by errors in the top level of a JSON API document.

```sh
$ http GET localhost:3000/v1/pokemon/2 Content-Type:application/vnd.api+json

HTTP/1.1 404 Not Found
(...)
{
    "errors": [
        {
            "detail": "Pokemon with id 2 not found",
            "status": "404",
            "title": "Resource not found"
        }
    ]
}
```

### Updating objects

> Any or all of a resource’s attributes MAY be included in the resource object included in a PATCH request.
>
> If a request does not include all of the attributes for a resource, the server MUST interpret the missing attributes as if they were included with their current values. The server MUST NOT interpret missing attributes as null values.

```sh
$ http PATCH localhost:3000/v1/pokemon/3 Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"3","attributes":{"species":"Happy Pokemon","weightKg":7}}'

HTTP/1.1 200 OK
(...)
{
    "data": {
        "attributes": {
            "abilities": [
                "Minus",
                "Vold Absorb"
            ],
            "generation": 3,
            "name": "Minun",
            "species": "Happy Pokemon",
            "types": [
                "Electric"
            ],
            "weightKg": 7
        },
        "id": "3",
        "type": "Pokemon"
    }
}
```
