---
publication: 'RAML Playground'
tags: ['API', 'Api Design', 'JSON', 'RAML', 'data']
license: 'cc-40-by'
---

# Conditional JSON properties (Part 2)

In [Part 1](https://medium.com/raml-api/conditional-json-properties-part-1-31c705787367), we covered several scenarios in which we defined sets of JSON properties that were either valid or invalid depending on the presence or absence of other properties. In this Part 2, we will focus on validating object properties based on their value and the value of other properties in that object.

## Sets of Properties

Sometimes we want objects to have a certain set of properties. Here, we have two properties `foo` and `bar`, that may be either respectively equal to `Foo` and `false` or to `Bar` and `true`.

```raml
#%RAML 1.0 DataType

type: object
properties:
  foo: string
  bar: boolean
enum:
  - foo: "Foo"
    bar: false
  - foo: "Bar"
    bar: true
```

which validates as follows:
```
{"foo": "Foo", "bar": false} # valid
{"foo": true, "bar": "Bar"} # invalid
{"foo": "Bar"} # invalid
{"foo": "Bar", "bar": true} # valid
{"qux": true} # invalid
{} # invalid
```

## Opposite values

In this scenario, we want the object to have at least two properties `foo` and `bar`, that may be either respectively of type `string` and `boolean` or `boolean` and `string`.

This object can be defined like this:
```raml
#%RAML 1.0 Library

Option1:
  properties:
    foo: 
      type: string
      enum: [Foo]
    bar: 
      type: boolean
      enum: [false]
Option2:
  properties:
    foo: 
      type: boolean
      enum: [true]
    bar: 
      type: string
      enum: [Bar]

MyObject: Option1 | Option2
```

which validates as follows:
```
{"foo": "Foo", "bar": false} # valid
{"foo": true, "bar": "Bar"} # valid
{"foo": "Bar"} # invalid
{"foo": "Bar", "bar": true} # valid
{"qux": true} # invalid
{} # invalid
```

## Any value

In this scenario, we have an object that must contain the two properies `foo` and `bar`, and only those two properties. Their respective value, however, can be of any type.

```raml
#%RAML 1.0 DataType

type: object
properties:
  foo: any
  bar: any
additionalProperties: false
```

which validates as follows:
```
{"foo": "Foo", "bar": false} # valid
{"foo": true, "bar": "Bar"} # valid
{"foo": "Bar"} # invalid
{"foo": "Bar", "bar": true} # valid
{"qux": true} # invalid
{} # invalid
```