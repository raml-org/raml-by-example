---
publication: 'RAML Playground'
tags: ['API', 'Api Design', 'JSON', 'RAML', 'data']
license: 'cc-40-by'
---

# Conditional JSON properties (Part 1)

One of the most important aspect of designing Web APIs is modeling its data layer. The data layer can take different shapes and it can be found at different levels of the API: URI parameters, query parameters, request and response headers, request and response bodies.

When modeling a JSON object -- the most common format for transmitting data these days -- we may want sets of properties to be either valid or invalid depending on the presence or the absence of other properties.

Let's take a look at different scenarios.

## All and only defined properties

This is the most common one. We want an object to contain all and only defined properties, here `foo` and `bar`. These properties must be respectivly `string` and `boolean`.

This object can be defined like this:
```raml
#%RAML 1.0 DataType

additionalProperties: false
properties:
  foo: string
  bar: boolean
```

which validates as follows:
```
{"foo": "lorem ipsum", "bar": false} # valid
{"foo": true, "bar": false} # invalid
{"foo": "lorem ipsum"} # invalid
{"bar": "lorem ipsum", "foo": false} # invalid
{"qux": 1} # invalid
{} # invalid
```

## Any of either defined or undefined properties

In some cases, we want to allow an object to contain any number of properties. However, if some specific properties are defined, here `foo` and `bar`, we want those properties to be of a certain type. 

This object can be defined like this:
```raml
#%RAML 1.0 DataType

properties:
  foo?: string
  bar?: boolean
```

which validates as follows:
```
{"foo": "lorem ipsum", "bar": false} # valid
{"foo": true, "bar": false} # invalid
{"foo": "lorem ipsum"} # valid
{"bar": "lorem ipsum", "foo": false} # invalid
{"qux": 1} # valid
{"foo": null, "bar": null} # invalid
{} # valid
```

## Making sure at least one property is defined

Building on the previous scenario, we want all of the above conditions and we also want to ensure at least one property is defined.

This object can be defined like this:
```raml
#%RAML 1.0 DataType

minProperties: 1
properties:
  foo?: string
  bar?: boolean
```

which validates as follows:
```
{"foo": "lorem ipsum", "bar": false} # valid
{"foo": true, "bar": false} # invalid
{"foo": "lorem ipsum"} # valid
{"bar": "lorem ipsum", "foo": false} # invalid
{"qux": 1} # valid
{} # invalid
```

## Any of only defined properties

Building again on the previous scenario, we want all of the above defined conditions but we also want to restrict the properties to only the ones defined.

This object can be defined like this:
```raml
#%RAML 1.0 DataType

additionalProperties: false
minProperties: 1
properties:
  foo?: string
  bar?: boolean
```

which validates as follows:
```
{"foo": "lorem ipsum", "bar": false} # valid
{"foo": true, "bar": false} # invalid
{"foo": "lorem ipsum"} # valid
{"bar": "lorem ipsum", "foo": false} # invalid
{"qux": 1} # invalid
{} # invalid
```

## Any defined properties, any defined types

Here, we want the object to contain at least one property, either `foo` or `bar`, but no additional properties. Either property can be `string` or `boolean`.

This object can be defined like this:
```raml
#%RAML 1.0 DataType

minProperties: 1
properties:
  /^(foo|bar)$/: string | boolean
```

which is equivalent to:
```raml
#%RAML 1.0 DataType

additionalProperties: false
minProperties: 1
properties:
  foo?: string | boolean
  bar?: string | boolean
```

and which validates as follows:
```
{"foo": "lorem ipsum", "bar": false} # valid
{"foo": true, "bar": false} # valid
{"foo": "lorem ipsum"} # valid
{"bar": "lorem ipsum", "foo": false} # valid
{"qux": 1} # invalid
{} # invalid
```

## Mirror properties

In this scenario, we want the object to have at least two properties `foo` and `bar`, which may be either `string` or `boolean`, but never at the same time.

This object can be defined like this:
```raml
#%RAML 1.0 Library

Option1:
  properties:
    foo: string
    bar: boolean
Option2:
  properties:
    foo: boolean
    bar: string
MyObject: Option1 | Option2
```

which validates as follows:
```
{"foo": "lorem ipsum", "bar": false} # valid
{"foo": true, "bar": false} # invalid
{"foo": "lorem ipsum"} # invalid
{"bar": "lorem ipsum", "foo": false} # valid
{"qux": 1} # invalid
{} # invalid
```
