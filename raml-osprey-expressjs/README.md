## Project elements

*pokemon_api/package.json* - Package file with dependencies.
*pokemon_api/api.raml* - JSON API spec that defines few routes, types and uses libraries. Available endpoints: `GET /pokemon, POST /pokemon, GET /pokemon/{id}, PATCH /pokemon/{id}, DELETE /pokemon/{id}`.
*pokemon_api/index.js* - Osprey/Express app. Defines helper funcs/middleware; request handlers; etc. Responses have proper content-type, status codes, location header on POST; data is wrapped the way JSON API requires it;
*pokemon_api/examples/* - Contains collection and item responses examples. These are used in a **Interacting with the server** section.
*pokemon_api/libraries/jsonApiLibrary.raml* - Defines RAML Data Types required to satisfy JSON API requirements.
*pokemon_api/libraries/jsonApiCollections.raml* - Defines resourceTypes and traits required to properly describe the JSON API RAML spec.

## Things changed in JSON API RAML lib

* Removed not used definitions (types, resourceTypes, traits) to make things simpler and avoid parsing errors;
* Replaced `<<dataType>>_post` and `<<dataType>>_post` definitions with explicit params like `<<dataTypePost>>` because parser coudn't find types referenced the old way. I think the original type of definition just wasn't valid.
* Had to split `success` type to `collectionSuccess` and `itemSuccess`. These represent collection/item response. Had to do it because `datatype-expansion` or something deeper doesn't process type unions (`foo | bar`) properly and validates schema against all types instead of "any".

These changes have no effect on the result, I'm just letting you know.

## Results/notes of the project

* JSON API valid spec/server;
* Headers validation by Osprey (Request body validation does not work for some reason. Not sure if that's Osprey issues or some other lib);
* Responses, requests, error messages formatted according to JSON API 1.0;
* Simple object is used instead of db;

## Interacting with the server

### Starting the server

```sh
cd pokemon_api
npm install .
node index.js
```

### List pokemon

Note how it sets `Content-Type: application/vnd.api+json` in the response. We also need to provide that header in all requests because JSON API requires so.

```sh
http GET localhost:3000/v1/pokemon Content-Type:application/vnd.api+json

HTTP/1.1 200 OK
(...)
{
    "data": []
}
```

### Create first pokemon

Note how `Location` is set in response.
We also need to provide `Accept` header because JSON API requires so. If not provided, Osprey will throw a validation error saying that not supported `Accept` content type is requested.

```sh
http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"1","attributes":{"name":"Bulbasaur","generation":1,"types":["Grass","Poison"],"species":"Seed Pokemon","abilities":["Overgrow","Chlorophyll"],"weightKg":7}}'

HTTP/1.1 201 Created
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

### Create few more pokemon

```sh
$ http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"2","attributes":{"name":"Emolga","generation":5,"types":["Electric","Flying"],"species":"Sky Squirrel Pokemon","abilities":["Static","Motor Drive"],"weightKg":5}}'
(...)

$ http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"3","attributes":{"name":"Minun","generation":3,"types":["Electric"],"species":"Cheering Pokemon","abilities":["Minus","Vold Absorb"],"weightKg":4}}'
(...)
```

### Get single pokemon

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

### Delete single pokemon

```sh
http DELETE localhost:3000/v1/pokemon/2 Content-Type:application/vnd.api+json
(...)
```

### Request not existing pokemon

```sh
http GET localhost:3000/v1/pokemon/2 Content-Type:application/vnd.api+json

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

### Edit pokemon

```sh
http PATCH localhost:3000/v1/pokemon/3 Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"3","attributes":{"species":"Happy Pokemon","weightKg":7}}'

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
