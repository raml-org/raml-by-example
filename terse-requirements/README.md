Now when converting datatypes from jsonSchema to raml (using the js2dt function of ramldt2jsonschema), the required status of properties is denoted using the less verbose syntax.

Previously, when converting from jsonschema, each property would have a required keyword, with value true or false.
As of v0.1.3, required properties are bare (the default being required) and optional properties are marked thus by a trailing questionmark added to the property's name.

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
