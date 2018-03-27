---
publication: 'RAML Playground'
tags: ['Api Design', 'JSON', 'RAML', 'null']
license: 'cc-40-by'
---

# How to describe properties as both optional and nullable in RAML?

Sometimes, I want my schemas to allow certain properties to be optional. This is how I can describe an object with two required and one optional properties in RAML:
```raml
#%RAML 1.0 DataType
type: object
properties:
  name: string
  email: string
  age?: number
```

This following data validates against that `DataType`:
```json
{
    "name": "Jon",
    "email": "jon@doe.com",
    "age": 95
}
```

and the following as well:
```json
{
    "name": "Jon",
    "email": "jon@doe.com"
}
```

but NOT the following:
```json
{
    "name": "Jon",
    "email": "jon@doe.com",
    "age": null
}
```

## How do I allow `null` values with RAML?

The [`Nil` type](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#nil-type) does exactly that. Combined with another type, in the form of an [union](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#union-type), it looks like this:

```raml
#%RAML 1.0 DataType
type: object
properties:
  name: string
  email: string
  age: number | nil
```

This means I am allowing the property "age" to be either a "string" or `nil` (`null` in JSON). However, this doesn't mean that the property can be ommited, **it is still a required property**.

## How do I allow both `null` values and optional properties with RAML?

The solution to making a property both optional and nullable is a combination of both [optional property declaration](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#property-declarations) and [`Nil` type](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#nil-type). This gives:

```raml
#%RAML 1.0 DataType
type: object
properties:
  name: string
  email: string
  age?: string | nil
```

Now, the three JSON data examples at the begining of this post validate against the `DataType` above.
