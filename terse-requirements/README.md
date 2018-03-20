# More concise syntax in v0.1.3
In v0.1.3 of raml2jsonschema json documents are now processed into more concise raml documents.

## Type Only Properties
Firstly, json schema properties with only a type declaration ie...
```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "User",
  "type": "object",
  "properties": {
    "email": {
      "type": "Email"
    }
  }
}
```
are converted to raml datatype properties with the form `property: type`
```
#%RAML 1.0 Library

types:
  User:
    type: object
    properties:
      email: Email
    displayName: User
```


## Terse Requirements
Now when converting datatypes from jsonSchema to raml (using the js2dt function of ramldt2jsonschema), the required status of properties is denoted using a less verbose syntax.

Previously, in the resulting raml datatype, each property would have a required keyword, with a value of true or false.
As of v0.1.3, required properties are not noted as such (required properties being the default) and optional properties are indicated by a trailing question mark appended to the property's name.

```
{
  "$schema": "http://json-schema.org/draft-04/schema#",
  "title": "Product",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "id": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "name": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "type": "number",
      "minimum": 0,
      "exclusiveMinimum": true
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1,
      "uniqueItems": true
    }
  },
  "required": ["id", "name", "price"]
}
```

Previously

```
#%RAML 1.0 Library

types:
  Product:
    description: A product from Acme's catalog
    type: object
    properties:
      id:
        description: The unique identifier for a product
        type: integer
        required: true
      name:
        description: Name of the product
        type: string
        required: true
      price:
        type: number
        minimum: 0
        required: true
      tags:
        type: array
        items:
          type: string
        minItems: 1
        uniqueItems: true
        required: false
    displayName: Product
```

v0.1.3

```
#%RAML 1.0 Library

types:
  Product:
    description: A product from Acme's catalog
    type: object
    properties:
      id:
        description: The unique identifier for a product
        type: integer
      name:
        description: Name of the product
        type: string
      price:
        type: number
        minimum: 0
      tags?:
        type: array
        items:
          type: string
        minItems: 1
        uniqueItems: true
    displayName: Product
```
