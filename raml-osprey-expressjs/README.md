## Interacting with the server

### List pokemon

Note how it sets `Content-Type: application/vnd.api+json` in the response. We also need to provide that header in all requests because JSON API requires so.

```sh
http GET localhost:3000/v1/pokemon Content-Type:application/vnd.api+json

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 11
Content-Type: application/vnd.api+json; charset=utf-8
Date: Wed, 23 May 2018 09:36:16 GMT
ETag: W/"b-EFAlOux7Kcr/ZEgGkn2r+oFAbu4"
X-Powered-By: Express

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
Connection: keep-alive
Content-Length: 189
Content-Type: application/vnd.api+json; charset=utf-8
Date: Wed, 23 May 2018 09:41:42 GMT
ETag: W/"bd-oO7lcAEqcTAkEr+8UqhbaKQofII"
Location: https://localhost:3000/v1/pokemon/1
X-Powered-By: Express

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
http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"2","attributes":{"name":"Emolga","generation":5,"types":["Electric","Flying"],"species":"Sky Squirrel Pokemon","abilities":["Static","Motor Drive"],"weightKg":5}}'

http POST localhost:3000/v1/pokemon Accept:application/vnd.api+json Content-Type:application/vnd.api+json data:='{"type":"Pokemon","id":"3","attributes":{"name":"Minun","generation":3,"types":["Electric"],"species":"Cheering Pokemon","abilities":["Minus","Vold Absorb"],"weightKg":4}}'
```

### Get single pokemon

```sh
http GET localhost:3000/v1/pokemon/1 Content-Type:application/vnd.api+json

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 189
Content-Type: application/vnd.api+json; charset=utf-8
Date: Wed, 23 May 2018 09:46:01 GMT
ETag: W/"bd-oO7lcAEqcTAkEr+8UqhbaKQofII"
X-Powered-By: Express

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

HTTP/1.1 204 No Content
Connection: keep-alive
Content-Type: application/vnd.api+json
Date: Wed, 23 May 2018 09:46:43 GMT
X-Powered-By: Express
```

### Request not existing pokemon

```sh
http GET localhost:3000/v1/pokemon/2 Content-Type:application/vnd.api+json

HTTP/1.1 404 Not Found
Connection: keep-alive
Content-Length: 97
Content-Type: application/json; charset=utf-8
Date: Wed, 23 May 2018 09:47:10 GMT
ETag: W/"61-9EIp+dsL2/fAcH/KfZoA+1ay8kU"
X-Powered-By: Express

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
Connection: keep-alive
Content-Length: 177
Content-Type: application/vnd.api+json; charset=utf-8
Date: Wed, 23 May 2018 09:48:22 GMT
ETag: W/"b1-4pdr264COd6pWQapOUuVqRMgDfw"
X-Powered-By: Express

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