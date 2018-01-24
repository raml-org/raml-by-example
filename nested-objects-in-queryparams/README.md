---
publication: 'RAML Playground'
tags: ['API', 'Rest Api', 'Api Design', 'JSON', 'RAML']
license: 'cc-40-by'
---

# Objects in query params

There is a debate over how objects should be represented in the "query" part of URIs. 

Some people prefer JSON:
```
?foo={bar:0} # URL-encoded: ?foo=%7Bbar%3A0%7D
```

Some people prefer dot notation:
```
?foo.bar=0
```

Some people prefer square brackets[1]:
```
?foo[bar]=0 # URL-encoded: ?foo%5Bbar%5D=0
```

They key word here is "prefer". As with most things, usage is a reflection of subjectivity and practicality. So we're not going to debate which one is more "correct" or better. Instead, let's dig into how we can represent those query parameters in our RAML API definitions.

Intuitively we can write:
```yaml
queryParameters:
  foo:
    properties:
      bar: integer
```

or to allow any key names:
```yaml
queryParameters:
  foo:
    properties:
      //: integer
```


or to allow only letters in key names:
```yaml
queryParameters:
  foo:
    properties:
      /^[a-zA-Z]+$/: integer
```

## What does the RAML spec say?[2]

> RAML does not define validation when a query parameter declaration specifies any of the following types for the value of the query parameter: an object type, (...). Processors MAY default to treating the format of the query parameter value as JSON in applying the type to instances of that query parameter, or they MAY allow other treatments based on annotations.

## What does this mean?

This means that it's up to the tool or implementation to handle objects in query parameters the way it needs. Different stacks/languages may handle objects differently, RAML aknowlegdes that.

## How do I enforce the format?

Back to our three format examples at the begining, our implementation most probably only supports one. There may be cases where enforcing the format of our object query parameters is necessary. 

So let's try that:
```yaml
queryParameters:
  /^foo\[[a-zA-Z]\]+$/: integer
```

☝️ This is an equivalent of the previous example. Again, there is no right or wrong. This last example, however, expresses the same query parameter more explicitly by enforcing the format of our object representation.

---
- [1] Note that the use of non-encoded square brackets outside of [Host](https://tools.ietf.org/html/rfc3986#section-3.2.2) is against rfc3986
- [2] See section "[Query Parameters in a Query String](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#query-parameters-in-a-query-string)" of the RAML specs
