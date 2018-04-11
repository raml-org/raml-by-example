---
publication: 'RAML Playground'
tags: ['Api Design', 'RAML', 'query params']
license: 'cc-40-by'
---

# Arrays in query params

The same way there is [no concensus over how objects should be represented in query parameters](https://medium.com/raml-api/objects-in-query-params-173d2712ce5b), there is no standardized way to format arrays of values in query parameters.

Arrays in query parameters are sometimes represented by repeating a parameter multiple times:
```
?foo=bar&foo=qux
```

Sometimes by repeating a parameter along with empty square brackets:
```
?foo[]=bar&foo[]=qux # URL-encoded: ?foo%5B%5D=bar&foo%5B%5D=qux
```

Sometimes by simply providing a list of comma-separated values:
```
?foo=bar,qux
```

## Why so many different ways?

There may be several factors. It can be a reflection of the way the underlying implementation works (e.g. backend framework, datastore). It can be due to the programming language of the implementation, because of the syntax or "style" of that language. It can also simply be a matter of taste and a particular decision made by the API designer.

## The "fields" example

Some APIs have a way to return partial objects in responses, that is, objects with a limited set of fields. Let's see how different groups of people have thought about formating that `fields` query parameter. And for each use-case, we'll see how to model that query parameter in RAML.

### JSON API

> A client MAY request that an endpoint return only specific fields in the response on a per-type basis by including a fields[TYPE] parameter.
> 
> The value of the fields parameter MUST be a comma-separated (U+002C COMMA, “,”) list that refers to the name(s) of the fields to be returned.
> 
> If a client requests a restricted set of fields for a given resource type, an endpoint MUST NOT include additional fields in resource objects of that type in its response.

(source: http://jsonapi.org/format/#fetching-sparse-fieldsets)

This is what it looks like:
```
?fields[articles]=title,body&fields[people]=name
```

and this is how it can be modeled in RAML:
```yaml
queryParameters:
  /^fields\[[a-zA-Z]\]+$/: # matches `fields[<string>]`
    type: string
    pattern: [^,]+ # matches both `title,body` and `name`
```

### Bitbucket API

> By default, each endpoint returns the full representation of a resource and in some cases that can be a lot of data. For example, retrieving a list of pull requests can amount to quite a large document.
> 
> For better performance, you can ask the server to only return the fields you really need and to omit unwanted data. To request a partial response and to add or remove specific fields from a response, use the fields query parameter.

(source: https://developer.atlassian.com/bitbucket/api/2/reference/meta/partial-response)

What it looks like:
```
?fields=-*,+foo,+bar
```

and how it can be modeled in RAML:
```yaml
queryParameters:
  fields:
    type: string
    pattern: (-|\+)?[^,]+
```

### Google Drive API

> By default, the server sends back the full representation of a resource after processing requests. For better performance, you can ask the server to send only the fields you really need and get a partial response instead.
> 
> To request a partial response, use the fields request parameter to specify the fields you want returned. You can use this parameter with any request that returns response data.

(source: https://developers.google.com/drive/v3/web/performance#partial)

What it looks like:
```
?fields=kind,items(title,characteristics/length)
```

and how it can be modeled in RAML:
```yaml
queryParameters:
  fields:
    type: string
    pattern: [^,]+
```

## Using RAML Traits for fine-grained control

In some situations, and in that "fields" use-case in particular, it may be useful to have fine-grained control over the fields passed to that "fields" query parameter.

Here is an example that leverages [RAML Traits](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#resource-types-and-traits) and [Trait Parameters](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#resource-type-and-trait-parameters) to define the fieldset that can be passed to a "fields" query parameter.

`api.raml`:
<script src="https://gist.github.com/57d1b33f3b195b8ddae8df50727ed977"></script>

`sparsable.raml`:
<script src="https://gist.github.com/fbfacd3d119965307e15d6e6c3d1d7e1"></script>
