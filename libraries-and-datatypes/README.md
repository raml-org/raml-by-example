---
publication: 'RAML Playground'
tags: ['API', 'RAML', 'API Design']
license: 'cc-40-by'
---

# RAML 101: Libraries and DataTypes Fragments

One of the great things about RAML is modularization. This gives the ability to separate concerns within an API specification. One feature that illustrates this concept quite well is "[Typed Fragments](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#typed-fragments)". There are two types of typed fragments that get confused often, namely "Libraries" and "DataTypes". They can be used to achieve similar goals, but their syntax is quite different. This blog post will show you how to use each.

## Basic Example

This is a "Library" fragment:
```raml
#%RAML 1.0 Library

types:
  myType:
    properties:
      foo: boolean
      bar: string
```

It can hold MULTIPLE types. Libraries are referred to using the `uses:` statement and a dot notation to refer to a type inside that library:
```raml
#%RAML 1.0
title: My API

uses:
  myLib: library.raml

/myresource:
  post:
    body:
      application/json:
        type: myLib.myType
```


This is a "DataType" fragment:
```raml
#%RAML 1.0 DataType

properties:
  foo: boolean
  bar: string

```
It can only hold a SINGLE type. DataTypes are referred to using the `!include` tag as value of a type:
```raml
#%RAML 1.0
title: My API

/myresource:
  post:
    body:
      application/json:
        type: !include dataType.raml
```

## Advanced Example

The great part is that we can combine both "Library" and "DataType" fragments to make for even more powerful modularization and use inheritance to combine both types of fragments in a meaningful way. In the example below, we have:

- a `DataType` fragment with two properties `one` and `two`:

<script src="https://gist.github.com/2fe949234ea83a0190ee5f1b07f7809e"></script>

- a `Library` fragment with two types declared, a first one referring to the `DataType` fragment above and the second one inheriting from the first while adding a `three` property:

<script src="https://gist.github.com/ccc605ee51a62ae56b7df2bcb18581c7"></script>

- and finally, an API definition that declares a request body inheriting from that second type in the `Library` fragment above while adding a `four` property.

<script src="https://gist.github.com/8910350aeec416c04f6af16d2e0b0526"></script>

---

## Let's recap

`Library` fragments:

- can hold multiple types
- are imported using the `uses:` statement
- are referred to using a dot notation, e.g. `type: library.typeInsideLibrary`

`DataType` fragments:

- hold a single type
- are imported using the `!include` tag as value of a type, e.g. `type: !include dataType.raml`
