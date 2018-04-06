---
publication: 'RAML Playground'
tags: ['Banking', 'Financial data', 'Rest Api', 'RAML']
license: 'cc-40-by'
---

# Modeling amounts (and other decimal types) in RAML

In JSON, values must be one of the following data types:

  - string
  - number
  - object
  - array
  - boolean
  - null

The RAML type system allows to model any of the JSON types and provides additional syntax to validate data. One of those syntactic facets -- which can be useful to model amounts (and other decimal types) -- is `multipleOf`. `multipleOf` can be applied to a [`type: number`](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#number). This is what the Spec says:

> A numeric instance is valid against "multipleOf" if the result of dividing the instance by this keyword's value is an integer.

## Example

Given this hypothetical bank API:

<script src="https://gist.github.com/2649922fa482a90b3111f76db6e0dff5"></script>

and the following "amount" DataType: 

<script src="https://gist.github.com/34e0ab682fb95a6371939818fc9da6d0"></script>

one would be able to make sure the payload for both `POST /customers/{customer_id}/accounts` and `PATCH /customers/{customer_id}/accounts/{account_id}` allows:

```json
{
    "balance": 101.18
}
```

but NOT:

```json
{
    "balance": 101.183
}
```
