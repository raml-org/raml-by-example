---
publication: 'RAML Playground'
tags: ['RAML', 'ramldt2jsonschema', 'JSON Schema']
license: 'cc-40-by'
---

# Designing a {JSON:API} API with RAML (Part 1/2)

JSON API is a specification that describes a set of conventions for building APIs in JSON. The [JSON API specs](http://jsonapi.org/format/) introduces it as follows:

> JSON API is a specification for how a client should request that resources be fetched or modified, and how a server should respond to those requests.
>
> JSON API is designed to minimize both the number of requests and the amount of data transmitted between clients and servers. This efficiency is achieved without compromising readability, flexibility, or discoverability.

Furthermore, the [front page](http://jsonapi.org) helps put things into perspective:

> If you’ve ever argued with your team about the way your JSON responses should be formatted, JSON API can be your anti-bikeshedding tool.
>
> By following shared conventions, you can increase productivity, take advantage of generalized tooling, and focus on what matters: your application.


## Where to start?

In this Part 1, we're going to design an API that follows the JSON API conventions. We will design this API in such a way that all its JSON API -specific patterns will be placed inside reusable RAML fragments. Those fragments may be reused later-on to design other APIs that follow the same JSON API conventions.

After designing this API, in Part 2, we'll be implementing it with NodeJS, [Express](https://expressjs.com) web framework and [Osprey](https://github.com/mulesoft/osprey) for payload validation.

* `api.raml`: this is our main RAML file
* `libraries/`: we'll put all the JSON API -specific fragments in there
* `libraries/jsonApiResourceTypes.raml`: RAML Resource Types
* `libraries/jsonApiTraits.raml`: RAML Traits
* `libraries/jsonApiTypes.raml`: RAML Types


## [Content Negotiation](http://jsonapi.org/format/#content-negotiation)

[What the Spec says](http://jsonapi.org/format/#content-negotiation):
> Clients MUST send all JSON API data in request documents with the header Content-Type: application/vnd.api+json without any media type parameters.
> (...)
> Servers MUST send all JSON API data in response documents with the header Content-Type: application/vnd.api+json without any media type parameters.

How it translates in our API Spec:
```raml
#%RAML 1.0
(...)
mediaType: application/vnd.api+json
(...)
```

## Document structure

[What the Spec says](http://jsonapi.org/format/#document-top-level):
> A document MUST contain at least one of the following top-level members:
> 
> * data: the document’s “primary data”
> * errors: an array of error objects
> * meta: a meta object that contains non-standard meta-information.
> 
> The members data and errors MUST NOT coexist in the same document.
> 
> A document MAY contain any of these top-level members:
> 
> * jsonapi: an object describing the server’s implementation
> * links: a links object related to the primary data.
> * included: an array of resource objects that are related to the primary data and/or each other (“included resources”).
> 
> If a document does not contain a top-level data key, the included member MUST NOT be present either.

How it translates in our API Spec:
```raml
(...)
types:
  response:
    properties:
      meta?: object
      jsonapi?: object
      links?: object
  success:
    description: A succesful (2xx) response body
    type: response
    additionalProperties: false
    properties:
      data: object
      included?:
        type: array
        items: object
  failure:
    description: A failure (4xx) response body
    type: response
    additionalProperties: false
    properties:
      errors:
        type: array
        items: object
  info:
    description: An information-only response body
    type: response
    additionalProperties: false
    properties:
      meta: object

```
