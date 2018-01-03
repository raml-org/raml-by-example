---
publication: 'RAML Playground'
tags: ['API', 'Rest Api', 'Api Design', 'JSON', 'RAML']
license: 'cc-40-by'
---

# Array enumeration in RAML

It's sometimes useful to define enumerated types such as:
```yaml
type: string
enum: [foo, bar]
```
to restrict possible values that that type allows.

## How about arrays?

With arrays, one may be tempted to write the enumerated list at the same level:
```yaml
type: array
enum: [one, two, three]
```
but that is wrong since the `enum` property refers to the parent type itself, not its children. 

This would work though:
```yaml
type: array
enum: [[one, two], [one, two, three]]
```
but it would be a tedious task to list all possible combinations, especially for large lists.

However, in RAML, arrays have an `items` property in which the type of all array items is defined and that's where the `enum` property of our example above should go:
```yaml
type: array
items:
  enum: [one, two, three]
```

Similarly, the equivalent JSON Schema would be:
```json
{
    "type": "array",
    "items": {
        "type": "string",
        "enum": ["one", "two", "three"]
    }
}
```
