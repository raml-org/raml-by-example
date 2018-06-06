---
publication: 'RAML Playground'
tags: ['Api Design', 'Rest Api', 'RAML', 'Query params', 'query string']
license: 'cc-40-by'
---

# Requiring query params

Sometimes we need to require specific [query parameters](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#query-strings-and-query-parameters) in URLs. There are different ways to go about it in RAML.

## Simply required

There is the obvious way:
```yaml
queryParameters:
  foo: string
```
or the equivalent way:
```yaml
queryString:
  properties:
    foo: string
```

By default, query parameters are required, so simply defining them makes them required.

## Either one required

There is a way to require either one of several parameters:
```yaml
queryString:
  type: FooParam | BarParam
```

with those query parameters previously defined as types:
```yaml
types:
  FooParam:
    properties:
      foo: string
  BarParam:
    properties:
      bar: number
```

## At least one required

There is a way to require that at least one query parameter is present:
```yaml
queryParameters:
  /^(foo|bar)$/: string
```

However, the only problem with that definition is that it implies all parameters to be of the same type. So an equivalent way which would allow query parameters to be of different types, would be:
```yaml
queryString:
  minProperties: 1
  properties:
    foo?: string
    bar?: number
```
