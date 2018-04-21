---
publication: 'RAML Playground'
tags: ['JWT', 'JOSE', encryption', 'Rest Api', 'Software Engineering', 'RAML']
license: 'cc-40-by'
---

# Modeling a JWT token

When designing APIs that return JWTs, I can use a RAML dataType `pattern` property to model a token, and thus validate its format:
```raml
#%RAML 1.0 DataType

myJWT:
  pattern: '[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?'
```

I can then re-use that type definition throughout my API specification. 

But that's not enough.

## How do I model encapsulated data?

The data encapsulated in a JWT token is composed of three parts:

- the JOSE header, e.g.:
```json
{
  "alg": "HS512",
  "typ": "JWT"
}
```

- the JWS payload, e.g.:
```json
{
  "Foo": 1,
  "Bar": 0,
  "name": "John Doe"
}
```

- and the JWS signature but we'll skip that part for now.

Going back to how to model this data, it would be fairly straighforward in [RAML](https://raml.org):
```raml
#%RAML 1.0 Library

types:
  myJOSEHeader:
    properties:
      alg:
        enum: [HS256, HS512]
      typ:
        enum: [JWT]
  myJWSPayload:
    properties:
      Foo: integer
      Bar: integer
      name: string
```

But that's still not enough.

The users of the API I am designing will consume encrypted data, so I need to have that as my payload definition. I would also like to describe the encapsulated data somehow. This can be useful to validate the encryption algorithms upon decryption, but also the payload JSON object itself once decrypted.

## How do I model both encrypted and encapsulated data?

I'll start by putting everything in a RAML library, let's call it `lib.raml`. This includes the `myJWT` type that describes my token and `myJOSEHeader` along with `myJWSPayload` that describe the encapsulated data. Note that I've placed those two types inside `annotationTypes`. I am doing this because they are not technically exposed in my API payloads so I am going to annotate my JWT payloads instead.

```raml
#%RAML 1.0 Library

types:
  myJWT:
    pattern: '[a-zA-Z0-9\-_]+?\.[a-zA-Z0-9\-_]+?\.([a-zA-Z0-9\-_]+)?'

annotationTypes:
  myJOSEHeader:
    allowedTargets: TypeDeclaration
    properties:
      alg:
        enum: [HS256, HS512]
      typ:
        enum: [JWT]
  myJWSPayload:
    allowedTargets: TypeDeclaration
    properties:
      Foo: integer
      Bar: integer
      name: string
```

Then, in my main API definition file: `api.raml`, I'll reference that `myJWT` type and those `myJOSEHeader` and `myJWSPayload` annotations:
```raml
#%RAML 1.0
title: Example API
mediaType: application/json

uses:
  lib: lib.raml

/resource:
  post:
    body:
      properties:
        token:
          type: lib.myJWT
          (lib.myJOSEHeader): 
          (lib.myJWSPayload):

```

Great!

## Wait, what if I want to make that information only visible to certain people?

With RAML, we can "hide" any information such as annotations from the main API spec file by externalizing that information inside a RAML overlay. That overlay will extend the main API spec. This way, we can decide to provide the overlay only to some while preserving the main API definition intact. The end result looks like this:

`lib.raml`:
<script src="https://gist.github.com/5d0a97e6c8fcd95f6f299a31c7ff7c14"></script>

`api.raml`:
<script src="https://gist.github.com/2ef6233b7e8e81ec56064c36bd8b2d54"></script>

`overlay.raml`:
<script src="https://gist.github.com/b06907250d583697f2024967332917ba"></script>

Voila!

