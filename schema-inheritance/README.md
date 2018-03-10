---
publication: 'RAML Playground'
tags: ['RAML', API', 'Rest Api', 'Software Engineering']
license: 'cc-40-by'
---

# Using RAML inheritance to design better schemas

Consider an API resource that returns invoices in the form:

```json
{
    "id": 0123456789,
    "amount": 100,
    "billTo": "ACME"
}
```

If I wanted to model this with RAML, I could write:

```raml
#%RAML 1.0
title: Invoice API
mediaType: application/json

/invoices:
  get:
    responses:
      200:
        body:
          type: object
          properties:
            id: number
            amount:
              type: number
              minimum: 0
            billTo:

```

## Re-using schemas

Now, if I wanted to add a POST method and re-use the schema initially defined in my GET method, I could define a RAML datatype and re-use it in both methods like this:

```raml
#%RAML 1.0
title: Invoice API
mediaType: application/json

types:
  Invoice:
    properties:
      id: number
      amount:
        type: number
        minimum: 0
      billTo:

/invoices:
  get:
    responses:
      200:
        body:
          type: Invoice
  post:
    body:
      type: Invoice

```

The issue with doing it this way is that in my POST request, the property `id` is not writeable, so it shouldn't be part of that POST request schema.

## Inheriting schemas

Where I am getting at here is that my base schema should be the lowest common denominator. It should include only the properties that are common to every requests and responses. In other words, I should take that `id` property out of my `Invoice` schema:

```raml
#%RAML 1.0
title: Invoice API
mediaType: application/json

types:
  Invoice:
    properties:
      amount:
        type: number
        minimum: 0
      billTo:

/invoices:
  get:
    responses:
      200:
        body:
          type: Invoice
          properties:
            id: number
  post:
    body:
      type: Invoice

```

## When NOT to inherit schemas

There is a catch. In some cases, I need to make properties optional but type inheritance [doesn't allow me to do so](https://github.com/raml-org/raml-spec/blob/master/versions/raml-10/raml-10.md#object-type-specialization):

> **a required property in the parent type cannot be changed to optional in the sub-type**

Oh no! What to do? 

Well, it's not that big of a deal when coming to think of it. Say I have a PATCH method that follows [RFC 5789](https://tools.ietf.org/html/rfc5789) which means that ALL properties must be optional. I can still describe that PATCH request but I'll have to make a dedicated schema for it:

```raml
#%RAML 1.0
title: Invoice API
mediaType: application/json

types:
  Invoice:
    properties:
      amount:
        type: number
        minimum: 0
      billTo:

/invoices:
  get:
    responses:
      200:
        body:
          type: Invoice
          properties:
            id: number
  post:
    body:
      type: Invoice
  patch:
    body:
      properties:
        amount?:
          type: number
          minimum: 0
        billTo?:

```

## Does that mean I can't reuse my schemas everywhere?

Not at all! The RAML type system is not limited to requests and responses. It allows to define reusable properties as well. So if I wanted to re-use that `amount` property definition across the board, I could write:

```raml
#%RAML 1.0
title: Invoice API
mediaType: application/json

types:
  Amount:
    type: number
    minimum: 0
  Invoice:
    properties:
      amount: Amount
      billTo:

/invoices:
  get:
    responses:
      200:
        body:
          type: Invoice
          properties:
            id: number
  post:
    body:
      type: Invoice
  patch:
    body:
      properties:
        amount?: Amount
        billTo?:

```

## Conclusion

This post was originally inspired by and written in response of a [Github issue](https://github.com/raml-org/raml-spec/issues/610) asking for an an equivalent, in RAML, for OAS `readOnly` and `writeOnly` properties. Instead of arguing against or in favor, I thought it would be more productive to showcase how the current RAML 1.0 spec allows to achieve the same thing, only in a more explicit way. 

In my opinion, this is more readable from a human perspective which is an aspect RAML promotes a lot. It allows to look at any request or response defined in RAML and tell right away which properties are part of that request or response.

